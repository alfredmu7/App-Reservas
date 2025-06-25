import React, { useEffect, useState } from 'react'
import "../styles/ProductPolicies.css"

export const ProductPolicies = () => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/policies", {credentials:"include"})
        .then(res => res.json())
        .then(data => setPolicies(data))
        .catch(err => console.error("no se pudieron cargar las políticas" , err));
    }, []);
    

  return (
    <div className='policy-block'>
        <h2 className='policy-tittle'>Políticas del servicio</h2>
        <div className='policy-grid'>
            {policies.map((policy) => (
                <div key={policy.id} className='policy-card'>
                    <h3 className='policy-card-tittle'>{policy.title}</h3>
                    <p className='policy-card-description'>{policy.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

