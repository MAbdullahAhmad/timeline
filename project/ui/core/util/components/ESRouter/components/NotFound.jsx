import React from "react";

export default function NotFound({ heading_prefix='Error 404:', heading='Not Found!', description='Requested resource not Found' }){
  return (
    <div>
      <h1>{heading_prefix} {heading}</h1>
      <p>{description}</p>
    </div>
  )
};