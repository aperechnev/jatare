import './LoaderBox.css'

export default function LoaderBox(
  { title, description }: { title: string, description: string }
) {
  return (
    <>
      <div className="center-loader" id="loaderBox">
        <div id="spinnerEl" className="spin"></div>
        <div className="loader-title" id="loaderTitle">{title}</div>
        <div className="loader-sub" id="loaderSub">{description}</div>
      </div>
    </>
  )
}
