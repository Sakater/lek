// Editor-Utils: DOM-Funktionen für Textformatierung

export const execCommand = (cmd: string, value?: string): boolean => {
  try {
    // Deprecation-Workaround
    return (document as any).execCommand(cmd, false, value);
  } catch {
    return false;
  }
};

export const queryCommandState = (cmd: string): boolean => {
  try {
    const fn = (document as any).queryCommandState;
    return typeof fn === 'function' ? !!fn.call(document, cmd) : false;
  } catch {
    return false;
  }
};

export const saveSelection = (): Range | null => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    return sel.getRangeAt(0);
  }
  return null;
};

export const restoreSelection = (range: Range | null) => {
  if (!range) return;
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

export const applyColor = (
  type: 'foreColor' | 'hiliteColor',
  color: string,
  range?: Range | null
) => {
  if (range) restoreSelection(range);
  if (type === 'foreColor') {
    execCommand('foreColor', color);
  } else {
    const ok = execCommand('hiliteColor', color);
    if (!ok) execCommand('backColor', color);
  }
};


