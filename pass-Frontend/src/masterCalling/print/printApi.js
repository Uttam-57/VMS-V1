import { queryGet } from "@/shared/services/api";

/**
 * Print API — backend calls for the print feature.
 * Used by: PrintPassByIdPage
 */

export const getPassForPrint = (idOrShortCode) =>
  queryGet(`/capture/${idOrShortCode}`);
