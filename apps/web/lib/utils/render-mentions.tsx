import React from 'react'

// Função para renderizar texto com mentions destacadas
export function renderMessageWithMentions(content: string): JSX.Element {
  const parts = content.split(/(@\w+|&[^&\s]+|#[^#\s]+|\$[^$\s]+)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-1 rounded"
            >
              {part}
            </span>
          )
        } else if (part.startsWith('&')) {
          return (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-1 rounded"
            >
              {part}
            </span>
          )
        } else if (part.startsWith('#')) {
          return (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 px-1 rounded"
            >
              {part}
            </span>
          )
        } else if (part.startsWith('$')) {
          return (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-1 rounded"
            >
              {part}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
