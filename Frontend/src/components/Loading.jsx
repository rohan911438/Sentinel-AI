import React from 'react'

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loader">
        <div className="spinner" />
        <div className="loader-text">Connecting Sentinel Committee…</div>
      </div>
    </div>
  )
}
