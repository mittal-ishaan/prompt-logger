import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
export default function Loader() {
  return (
    <div className='w-full text-center flex justify-center h-screen absolute items-center'><ClipLoader color={"lightblue"}
      size={100}
      aria-label="Loading Spinner"
      data-testid="loader" /></div>
  )
}