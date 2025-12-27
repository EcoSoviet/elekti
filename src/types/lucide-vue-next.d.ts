import type { FunctionalComponent, SVGAttributes } from "vue";

export interface LucideIconProps extends SVGAttributes {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

export type LucideIcon = FunctionalComponent<LucideIconProps>;

declare module "lucide-vue-next" {
  export { LucideIcon, LucideIconProps };
  export const AlertCircle: LucideIcon;
  export const Copy: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Trophy: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Globe: LucideIcon;
}
