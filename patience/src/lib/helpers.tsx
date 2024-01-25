import { Sx } from "@mantine/core";

export function forwardSx(sx: Sx | (Sx | undefined)[] | undefined) {
  return Array.isArray(sx) ? sx : [sx];
}
