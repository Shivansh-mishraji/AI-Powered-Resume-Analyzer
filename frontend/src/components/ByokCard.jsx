import ApiKeyInput from './ApiKeyInput';

export default function ByokCard({
  value, onChange, onClear,
  isEnabled, saveToSession,
  onToggleEnabled, onToggleSave,
  disabled = false
}) {
  return (
    <ApiKeyInput
      value={value}
      onChange={onChange}
      onClear={onClear}
      isEnabled={isEnabled}
      saveToSession={saveToSession}
      onToggleEnabled={onToggleEnabled}
      onToggleSave={onToggleSave}
      disabled={disabled}
    />
  );
}
