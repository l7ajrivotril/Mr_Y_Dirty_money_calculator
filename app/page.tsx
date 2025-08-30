"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DollarSign, Crown, Banknote, Calculator, Percent, Clock, TrendingUp } from "lucide-react"

export default function MafiaMoneyCalculator() {
  const [bandeOfNote, setBandeOfNote] = useState<number>(0)
  const [rolletCash, setRolletCash] = useState<number>(0)
  const [dirtyMoney, setDirtyMoney] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [twentyPercent, setTwentyPercent] = useState<number>(0)

  const [dailyTotal, setDailyTotal] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [lastReset, setLastReset] = useState<number>(Date.now())

  // Calculate totals whenever inputs change
  useEffect(() => {
    const calculatedTotal = bandeOfNote * 500 + rolletCash * 100 + dirtyMoney * 1
    setTotal(calculatedTotal)
    setTwentyPercent(calculatedTotal * 0.2)
  }, [bandeOfNote, rolletCash, dirtyMoney])

  useEffect(() => {
    // Charger les données sauvegardées
    const savedDailyTotal = localStorage.getItem("dailyTotal")
    const savedLastReset = localStorage.getItem("lastReset")

    if (savedDailyTotal) setDailyTotal(Number(savedDailyTotal))
    if (savedLastReset) setLastReset(Number(savedLastReset))

    const updateTimer = () => {
      const now = Date.now()
      const timeSinceReset = now - lastReset
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (timeSinceReset >= twentyFourHours) {
        // Réinitialiser après 24h
        setDailyTotal(0)
        const newResetTime = now
        setLastReset(newResetTime)
        localStorage.setItem("dailyTotal", "0")
        localStorage.setItem("lastReset", newResetTime.toString())
      } else {
        // Calculer le temps restant
        const remaining = twentyFourHours - timeSinceReset
        const hours = Math.floor(remaining / (60 * 60 * 1000))
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [lastReset])

  const addToDailyTotal = () => {
    const newDailyTotal = dailyTotal + total
    setDailyTotal(newDailyTotal)
    localStorage.setItem("dailyTotal", newDailyTotal.toString())
    // Réinitialiser le calculateur après ajout
    resetCalculator()
  }

  const resetCalculator = () => {
    setBandeOfNote(0)
    setRolletCash(0)
    setDirtyMoney(0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/mafia-character-bg.webp')",
          filter: "blur(8px) brightness(0.3)",
          zIndex: -2,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-[-1]" />

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-primary tracking-wider">MR Y</h1>
              <Crown className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Dirty Money Calculator</h2>
            <p className="text-muted-foreground text-lg italic">"Keep your friends close, but your money closer"</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Banknote className="h-5 w-5" />
                    Revenue Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bande of Note */}
                  <div className="space-y-2">
                    <Label htmlFor="bande-note" className="text-foreground font-medium">
                      Bande of Note (× 500)
                    </Label>
                    <div className="relative">
                      <Input
                        id="bande-note"
                        type="number"
                        value={bandeOfNote || ""}
                        onChange={(e) => setBandeOfNote(Number(e.target.value) || 0)}
                        className="bg-input border-border text-foreground pl-10"
                        placeholder="0"
                        min="0"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Value: {formatCurrency(bandeOfNote * 500)}</p>
                  </div>

                  {/* Rollet Cash */}
                  <div className="space-y-2">
                    <Label htmlFor="rollet-cash" className="text-foreground font-medium">
                      Rollet Cash (× 100)
                    </Label>
                    <div className="relative">
                      <Input
                        id="rollet-cash"
                        type="number"
                        value={rolletCash || ""}
                        onChange={(e) => setRolletCash(Number(e.target.value) || 0)}
                        className="bg-input border-border text-foreground pl-10"
                        placeholder="0"
                        min="0"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Value: {formatCurrency(rolletCash * 100)}</p>
                  </div>

                  {/* Dirty Money */}
                  <div className="space-y-2">
                    <Label htmlFor="dirty-money" className="text-foreground font-medium">
                      Dirty Money (× 1)
                    </Label>
                    <div className="relative">
                      <Input
                        id="dirty-money"
                        type="number"
                        value={dirtyMoney || ""}
                        onChange={(e) => setDirtyMoney(Number(e.target.value) || 0)}
                        className="bg-input border-border text-foreground pl-10"
                        placeholder="0"
                        min="0"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Value: {formatCurrency(dirtyMoney * 1)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={resetCalculator}
                      variant="outline"
                      className="flex-1 border-border hover:bg-muted bg-transparent"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={addToDailyTotal}
                      disabled={total === 0}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Add to Total
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Total */}
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Calculator className="h-5 w-5" />
                    Total Funds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">{formatCurrency(total)}</div>
                    <p className="text-muted-foreground">Total available amount</p>
                  </div>
                </CardContent>
              </Card>

              {/* 20% Cut */}
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Percent className="h-5 w-5" />
                    Commission (20%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-accent">{formatCurrency(twentyPercent)}</div>
                    <p className="text-muted-foreground">Family's share</p>
                  </div>
                </CardContent>
              </Card>

              {/* Remaining Amount */}
              <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <DollarSign className="h-5 w-5" />
                    Net Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(total - twentyPercent)}</div>
                    <p className="text-muted-foreground">After commission</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Daily Total (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">{formatCurrency(dailyTotal)}</div>
                <p className="text-muted-foreground">Money accumulated today</p>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Reset in:</span>
                  </div>
                  <div className="text-2xl font-bold text-accent font-mono">{timeRemaining}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-6 border-t border-border">
            <p className="text-muted-foreground text-sm">
              {"🤵 Confidentiality guaranteed • Secure transactions • MR Y Family Business 🤵"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
