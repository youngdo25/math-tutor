import { additionModule } from "./addition";
import { multiplicationModule } from "./multiplication";
import { subtractionModule } from "./subtraction";
import type { ProblemModule, ProblemModuleId } from "./types";

export const problemModules: Record<ProblemModuleId, ProblemModule> = {
  multiplication: multiplicationModule,
  addition: additionModule,
  subtraction: subtractionModule,
};

export function getModule(id: ProblemModuleId): ProblemModule {
  return problemModules[id];
}

export * from "./types";
