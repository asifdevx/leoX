import React from 'react'

const Input = ({ placeholder, name, type, value, handleChange }:InputProps) => {

  return (
    <input
    placeholder={placeholder}
    type={type}
    step="1"
    required
    value={value}
    onChange={handleChange}
    className="my-2 w-full p-2 outline-none bg-white/35 text-black border-[#675e5e44] border-2 rounded-xl text-sm white-glassmorphism"
  />
  )
}

export default Input