import "../styles/FeatureBlock.css"

export const FeatureBlock = ({features}) => {
    if(!features || features.length === 0)
        
        return null;


  return (
    <div className='feature-block'>
        <h3 className='features-tittle'>Características</h3>
        <ul className='features-list'>
            {features.map((feature) =>(
                <li key={feature.id} className='feature-items'>
                    <i className={`fa-solid ${feature.icon} feature-icon`}></i>
                    <span>{feature.name}</span>
                </li>
            ))}
        </ul>
    </div>
  )
}
