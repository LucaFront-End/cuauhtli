"use client";

import * as React from "react";

/* ----------------------------------------------------------------------------
 * Nepal Address Picker (Reference component from 21st.dev)
 * -------------------------------------------------------------------------- */

type Point = [number, number];
type BBox = [number, number, number, number];

export interface Province {
  id: number;
  name: string;
  nameNe: string;
  color: string;
  label: Point;
  bbox: BBox;
  d: string;
}

export interface District {
  id: string;
  name: string;
  nameNe: string;
  provinceId: number;
  postalCode: string;
  label: Point;
  bbox: BBox;
  d: string;
}

export interface NepalAddress {
  provinceId: number;
  province: string;
  districtId: string;
  district: string;
  postalCode: string;
  addressLine: string;
  formatted: string;
}

export interface NepalAddressPickerProps {
  defaultDistrictId?: string;
  defaultAddressLine?: string;
  onChange?: (address: NepalAddress | null) => void;
  includeKalapani?: boolean;
  showNepali?: boolean;
  theme?: "light" | "dark" | "system";
  className?: string;
}

export function NepalAddressPicker(props: NepalAddressPickerProps) {
  return (
    <div className={`nap-reference ${props.className || ''}`} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <p style={{ fontWeight: 600, color: '#0b1120', marginBottom: '8px' }}>
        Nepal Address Picker (Componente Base 21st.dev)
      </p>
      <p style={{ fontSize: '13px', color: '#64748b' }}>
        Para la plataforma activa de Sistemas Cuauhtli se adaptó este patrón a la cartografía oficial de la República Mexicana en <code>src/components/ui/mexico-presence-picker.jsx</code>.
      </p>
    </div>
  );
}

export default NepalAddressPicker;
