CREATE TABLE IF NOT EXISTS [Filter] (
	[Id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	[Filter] VARCHAR NOT NULL,
	[Valid] INTEGER NOT NULL DEFAULT 1
);
