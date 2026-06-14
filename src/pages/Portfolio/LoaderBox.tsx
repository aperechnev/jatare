import './LoaderBox.css'

export default function LoaderBox() {
  return (
    <>
      <div className="center-loader" id="loaderBox">
        <div id="spinnerEl" className="spin"></div>
        <div className="loader-title" id="loaderTitle">Fetching portfolio…</div>
        <div className="loader-sub" id="loaderSub">Scanning Ethereum and 3 more networks</div>
      </div>
    </>
  )
}
