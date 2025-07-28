import fs from "node:fs";
import path from "node:path";

const moduleName = process.argv[2];

if (!moduleName) {
	console.error("Please provide a module name.");
	process.exit(1);
}

// Helper functions for naming conventions
const toPascalCase = (str: string) => {
	return str
		.split(/[_\s-]+/) // Split by underscore, space, or hyphen
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("");
};

const toCamelCase = (str: string) => {
	const pascal = toPascalCase(str);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toSnakeCase = (str: string) => {
	return str
		.replace(/([A-Z])/g, "_$1") // Add underscore before capital letters
		.replace(/^_/, "") // Remove leading underscore
		.toLowerCase()
		.replace(/[_\s-]+/g, "_"); // Replace multiple separators with single underscore
};

// Convert input to snake_case for consistency
const normalizedInput = toSnakeCase(moduleName);

// Determine if input is already plural
const isPlural = normalizedInput.endsWith("s") && !normalizedInput.endsWith("ss");

// Plural folder and files (snake_case)
const pluralModuleName = isPlural ? normalizedInput : `${normalizedInput}s`;
const ModuleName = toPascalCase(pluralModuleName);

// Prisma model name (singular, camelCase)
const prismaModelName = isPlural ? toCamelCase(normalizedInput.slice(0, -1)) : toCamelCase(normalizedInput);

const baseDir = path.join(__dirname, "src", "modules");
const modulePath = path.join(baseDir, pluralModuleName);

if (fs.existsSync(modulePath)) {
	console.error(`Module '${pluralModuleName}' already exists.`);
	process.exit(1);
}

try {
	fs.mkdirSync(modulePath, { recursive: true });

	// Convert to singular for controller function names
	const singularModuleName = isPlural ? normalizedInput.slice(0, -1) : normalizedInput;
	const singularName = toCamelCase(singularModuleName);
	const SingularName = toPascalCase(singularModuleName);

	const files: Record<string, string> = {
		[`${pluralModuleName}.controllers.ts`]: `import catchAsync from "@/shared/catchAsync.js";

const create${SingularName} = catchAsync(async (req, res) => {
  console.log(req, res);
});

const get${ModuleName} = catchAsync(async (req, res) => {
  console.log(req, res);
});

const get${SingularName}ById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const update${SingularName}ById = catchAsync(async (req, res) => {
  console.log(req, res);
});

const delete${SingularName}ById = catchAsync(async (req, res) => {
  console.log(req, res);
});

export const ${ModuleName}Controllers = {
  create${SingularName},
  get${ModuleName},
  get${SingularName}ById,
  update${SingularName}ById,
  delete${SingularName}ById,
};
`,

		[`${pluralModuleName}.services.ts`]: `import { prisma } from "@/shared/prisma.js";

const create${SingularName}IntoDB = async () => {
  // Example: return await prisma.${prismaModelName}.create({ data: {...} });
};

const get${ModuleName}FromDB = async () => {
  return await prisma.${prismaModelName}.findMany();
};

const get${SingularName}ByIdFromDB = async () => {
  // Example: return await prisma.${prismaModelName}.findUnique({ where: {...} });
};

const update${SingularName}ByIdIntoDB = async () => {
  // Example: return await prisma.${prismaModelName}.update({ where: {...}, data: {...} });
};

const delete${SingularName}ByIdFromDB = async () => {
  // Example: return await prisma.${prismaModelName}.delete({ where: {...} });
};

export const ${ModuleName}Services = {
  create${SingularName}IntoDB,
  get${ModuleName}FromDB,
  get${SingularName}ByIdFromDB,
  update${SingularName}ByIdIntoDB,
  delete${SingularName}ByIdFromDB,
};
`,

		[`${pluralModuleName}.routes.ts`]: `import { createRouter } from "@/shared/createRouter.js";
import { ${ModuleName}Controllers } from "./${pluralModuleName}.controllers.js";

const router = createRouter();

router.post("/", ${ModuleName}Controllers.create${SingularName});
router.get("/", ${ModuleName}Controllers.get${ModuleName});
router.get("/:id", ${ModuleName}Controllers.get${SingularName}ById);
router.patch("/:id", ${ModuleName}Controllers.update${SingularName}ById);
router.delete("/:id", ${ModuleName}Controllers.delete${SingularName}ById);

export const ${ModuleName}Routes = router;
`,

		[`${pluralModuleName}.types.ts`]: `export type T${SingularName} = {
  id: string;
  name: string;
  email: string;
};
`,

		[`${pluralModuleName}.validators.ts`]: `import z from "zod";

const create${SingularName}ValidationSchema = z.object({
  body: z.object({
    // name: z.string().min(2).max(100),
    // email: z.email(),
  }),
});

const ${singularName}IdParamsValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

const update${SingularName}ByIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    // name: z.string().min(2).max(100).optional(),
    // email: z.email().optional(),
  }),
});

export const ${ModuleName}Validators = {
  create${SingularName}ValidationSchema,
  ${singularName}IdParamsValidationSchema,
  update${SingularName}ByIdValidationSchema,
};
`,
	};

	for (const fileName in files) {
		const filePath = path.join(modulePath, fileName);
		fs.writeFileSync(filePath, files[fileName] as string);
		console.log(`Created file: ${filePath}`);
	}

	console.log(`Module '${pluralModuleName}' generated successfully in src/app/modules.`);
} catch (error) {
	console.error("Error generating module:", error);
	process.exit(1);
}
