const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'campus.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Convert PostgreSQL $1, $2 syntax to SQLite ? syntax
function convertQuery(query) {
  let converted = query;
  let paramIndex = 1;
  while (converted.includes(`$${paramIndex}`)) {
    converted = converted.replace(`$${paramIndex}`, '?');
    paramIndex++;
  }
  // Remove RETURNING clause for SQLite compatibility
  converted = converted.replace(/\s+RETURNING\s+.*/i, '');
  return converted;
}

module.exports = {
  query: (text, params = []) => {
    try {
      const convertedQuery = convertQuery(text);
      const stmt = db.prepare(convertedQuery);
      
      // Check if this is a SELECT query
      if (convertedQuery.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return Promise.resolve({
          rows: rows,
          rowCount: rows.length,
        });
      } else {
        // INSERT, UPDATE, DELETE
        const result = stmt.run(...params);
        
        // For INSERT with RETURNING, fetch the last inserted row
        if (text.includes('RETURNING') && result.changes > 0) {
          const selectMatch = text.match(/RETURNING\s+(.+)$/i);
          if (selectMatch) {
            const columns = selectMatch[1].trim();
            const tableName = text.match(/INTO\s+(\w+)/i)?.[1] || 'users';
            const lastIdQuery = `SELECT ${columns} FROM ${tableName} WHERE rowid = last_insert_rowid()`;
            const returnedRows = db.prepare(lastIdQuery).all();
            return Promise.resolve({
              rows: returnedRows,
              rowCount: result.changes,
            });
          }
        }
        
        return Promise.resolve({
          rows: [],
          rowCount: result.changes,
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
