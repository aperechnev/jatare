import './Footer.css'

export default function Footer() {
    return (
        <div className="footer">
            <div className="ft-grid">
                <div className="ft-brand">
                    <div className="logo">Jatare</div>
                    <p>On-chain portfolio tracker for DeFi. Track assets, debt, and rebalancing targets across all your wallets.</p>
                    <div className="networks">
                        <span className="net">Ethereum</span>
                        <span className="net">Arbitrum</span>
                        <span className="net">Optimism</span>
                        <span className="net">Base</span>
                        <span className="net">Polygon</span>
                        <span className="net">Avalanche</span>
                        <span className="net">+6 more</span>
                    </div>
                </div>

                <div className="ft-col">
                    <h4>Product</h4>
                    <a>Portfolio tracker</a>
                    <a>Rebalancing</a>
                    <a>Risk monitor</a>
                    <a>ENS support</a>
                    <a>Changelog</a>
                </div>

                <div className="ft-col">
                    <h4>Developers</h4>
                    <a>API docs</a>
                    <a>GitHub</a>
                    <a>Status page</a>
                    <a>Rate limits</a>
                </div>

                <div className="ft-col">
                    <h4>Company</h4>
                    <a>About</a>
                    <a>Blog</a>
                    <a>Twitter / X</a>
                    <a>Privacy policy</a>
                    <a>Terms of service</a>
                </div>
            </div>

            <div className="ft-bottom">
                <div className="ft-copy">© 2026 Jatare. All rights reserved.</div>
                <div className="ft-status"><div className="dot"></div>All systems operational</div>
                <div className="ft-social">
                    <a aria-label="Twitter"><i className="ti ti-brand-x" aria-hidden="true"></i></a>
                    <a aria-label="GitHub"><i className="ti ti-brand-github" aria-hidden="true"></i></a>
                    <a aria-label="Discord"><i className="ti ti-brand-discord" aria-hidden="true"></i></a>
                    <a aria-label="Telegram"><i className="ti ti-brand-telegram" aria-hidden="true"></i></a>
                </div>
            </div>
        </div>
    )
}
