

const AdsPlacement = ({ type = 'leaderboard', style }) => {
    // Placeholder for AdSense integration.
    // Real usage: <ins className="adsbygoogle" ...>...</ins>
    return (
        <div className={`ad-slot ad-${type}`} style={style}>
            <div>Google AdSense - {type}</div>
        </div>
    );
};

export default AdsPlacement;
