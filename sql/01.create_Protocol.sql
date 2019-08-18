CREATE TABLE IF NOT EXISTS [Protocol] (
	[Id] INTEGER NOT NULL PRIMARY KEY,
	[Name] VARCHAR NOT NULL
);

INSERT INTO [Protocol] ([Id], [Name])
	SELECT 1, 'matrix'
	WHERE NOT EXISTS (
		SELECT 1 FROM [Protocol]
		WHERE [Id] = 1
	);

INSERT INTO [Protocol] ([Id], [Name])
	SELECT 2, 'discord'
	WHERE NOT EXISTS (
		SELECT 1 FROM [Protocol]
		WHERE [Id] = 2
	);
