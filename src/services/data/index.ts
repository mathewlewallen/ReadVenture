/**
 * GraphQL query and mutation exports
 * @module services/data
 */

// Export all GraphQL queries and mutations with type checking
export type { QueryTypes } from './queries.gql';
export type { MutationTypes } from './mutations.gql';
export { queries } from './queries.gql';
export { mutations } from './mutations.gql';

// Re-export individual operations for granular imports
export {
  GET_USER_PROGRESS,
  GET_READING_LIST,
  GET_STORY_DETAILS,
} from './queries.gql';

export {
  UPDATE_PROGRESS,
  SAVE_READING_STATE,
  UPDATE_USER_SETTINGS,
} from './mutations.gql';

/**
 * @throws {Error} If GraphQL files fail to load or parse
 * @see src/services/api/client.ts for GraphQL client configuration
 * @see tests/unit/services/data/queries.test.ts for query tests
 * @see tests/unit/services/data/mutations.test.ts for mutation tests
 */
