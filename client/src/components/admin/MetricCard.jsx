const MetricCard = ({ label, value, helper }) => (
  <div className="panel metric-card">
    <p className="muted">{label}</p>
    <h2>{value}</h2>
    {helper && <span className="muted small">{helper}</span>}
  </div>
);

export default MetricCard;
