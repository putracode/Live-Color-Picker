/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("history", {
    id: "id",
    userId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    colorName: { type: "varchar(50)", notNull: true },
    hex: { type: "varchar(50)", notNull: true },
    rgb: { type: "varchar(50)", notNull: true },
    hsl: { type: "varchar(50)", notNull: true },
    hsv: { type: "varchar(50)", notNull: true },
    timestamp: { type: "timestamp", notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("history");
};
