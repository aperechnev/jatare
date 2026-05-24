import { Button } from '@/components/ui/button'
import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

function Wallet() {
  const { address, isConnected } = useAccount()

  const {
    connect,
    connectors,
  } = useConnect()

  const { disconnect } = useDisconnect()

  return (
    <div>
      {!isConnected && (
        <div className="mt-6 flex flex-col gap-3">
          <p>Connect your wallet to get started.</p>
          <div className="flex flex-row gap-4">
            {connectors.map((connector) => (
              <Button
                size="sm"
                variant="outline"
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isConnected && (
        <div className="space-y-6">
          <div>
            <p className="text-zinc-400 mb-2">
              Connected wallet:
            </p>

            <p className="font-mono break-all">
              {address}
            </p>
          </div>

          <button
            onClick={() => disconnect()}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

export default Wallet
