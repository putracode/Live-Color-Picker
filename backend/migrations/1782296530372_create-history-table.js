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
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    color_name: { type: "VARCHAR(100)", notNull: true },
    hex: { type: "VARCHAR(20)", notNull: true },
    rgb: { type: "VARCHAR(50)", notNull: true },
    hsl: { type: "VARCHAR(50)", notNull: true },
    hsv: { type: "VARCHAR(50)", notNull: true },
    created_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
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
