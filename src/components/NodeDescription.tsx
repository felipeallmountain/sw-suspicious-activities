const NodeDescription = (props: TSwEntity) => {
  const { id, name, type, description, details, connections } = props;

  const baseClass = 'absolute max-w-[50%] min-w-[30%] '

  return (
    <article className={`absolute w-full h-full grid`}>
      <div className={`m-10 relative grid-rows-1`}>
        <div className={`${baseClass} top-0 left-0 bg-gradient-to-b from-blue-900 to-black p-6 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 mx-auto animate-glow`}>
          <h2 className={`text-cyan-300 text-xl font-bold mb-4`}>{name} ({id})</h2>
          <p className={`text-white mb-2`}><strong>Type:</strong> {type}</p>
        </div>        

        <div className={`${baseClass} top-0 right-0 w-1/3 bg-black/50 p-4 rounded mb-4 mx-auto animate-glow`}>
          <p className={`text-orange-400 font-semibold`}>Description</p>
          <p className={`text-white`}>{description}</p>
        </div>

        <div className={`${baseClass} left-0 bottom-0 bg-black/50 p-4 rounded mb-4 animate-glow`}>
          <p className={`text-orange-400 font-semibold`}>Details</p>
          <ul>
            {Object.keys(details).map((title, index) => {
              return (
                <li key={index}>
                  <strong>{title}:</strong> {details[title]}
                </li>
              )
            })}
          </ul>
        </div>

        <div className={`${baseClass} right-0 bottom-0 bg-black/50 p-4 rounded animate-glow`}>
          <p className={`text-orange-400 font-semibold`}>Connections</p>
          <ul>
            {connections.map((connection, index) => {
              return (
                <li key={index}>
                  <strong className={`text-cyan-300`}>{connection.relationship} ({connection.id}):</strong> Strength {connection.strength}
                </li>

              )
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default NodeDescription;
