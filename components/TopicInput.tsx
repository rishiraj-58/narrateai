import React from 'react'

interface TopicInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  placeholder?: string
}

export default function TopicInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = '',
}: TopicInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center gap-4">
      <input
        type="text"
        className="input-field flex-1"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        required
        maxLength={120}
        autoFocus
      />
      <button
        type="submit"
        className="btn-primary min-w-[140px]"
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Script'
        )}
      </button>
    </form>
  )
} 