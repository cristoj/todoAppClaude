import { Button } from '@/_shared/infrastructure/components/ui/button'
import { Card } from '@/_shared/infrastructure/components/ui/card'

function App() {
  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-4xl font-bold mb-4">Todo App</h1>
        <p className="text-muted-foreground mb-4">
          Simple minimalist todo web app to record todo list on localStorage.
        </p>
        <Button>Get Started</Button>
      </Card>
    </div>
  )
}

export default App
