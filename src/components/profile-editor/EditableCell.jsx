import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

/**
 * EditableCell – controlled TextField that syncs parent state onBlur only,
 * avoiding mid-type re-render focus loss when used inside MRT tables.
 */
const EditableCell = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  sx = {},
  inputProps = {},
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value ?? '');

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  return (
    <TextField
      size="small"
      type={type}
      value={localValue}
      disabled={disabled}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => onChange(localValue)}
      placeholder={placeholder}
      variant="outlined"
      sx={{ width: '100%', minWidth: 80, ...sx }}
      slotProps={{
        input: {
          style: { fontSize: '0.8125rem', ...inputProps.style },
          ...inputProps,
        },
      }}
    />
  );
};

export default EditableCell;
