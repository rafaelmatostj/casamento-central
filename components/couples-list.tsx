"use client"

import { Heart, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Couple {
  id: number
  husband: string
  wife: string
  weddingDate: string
  photo: string
  hasWeddingDate: boolean
}

interface CouplesListProps {
  couples: Couple[]
  parseDate: (dateString: string) => Date | null
  calculateMarriageTime: (weddingDate: string) => {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  onCoupleClick: (couple: Couple) => void
}

export function CouplesList({ couples, parseDate, calculateMarriageTime, onCoupleClick }: CouplesListProps) {
  const formatDate = (dateString: string) => {
    const date = parseDate(dateString)
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getNextAnniversary = (couple: Couple) => {
    if (!couple.hasWeddingDate) return null

    const today = new Date()
    const wedding = parseDate(couple.weddingDate)
    if (!wedding) return null

    const thisYear = today.getFullYear()
    const nextAnniversary = new Date(thisYear, wedding.getMonth(), wedding.getDate())

    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(thisYear + 1)
    }

    const daysUntil = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Lista de Casais ({couples.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {couples.map((couple) => {
            const daysUntilAnniversary = getNextAnniversary(couple)
            const marriageTime = calculateMarriageTime(couple.weddingDate)

            return (
              <div
                key={couple.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={couple.photo || "/placeholder.svg"} alt={`${couple.husband} e ${couple.wife}`} />
                  <AvatarFallback className="bg-pink-100 text-pink-600">
                    {couple.husband.charAt(0)}
                    {couple.wife.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {couple.husband} & {couple.wife}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {couple.hasWeddingDate
                        ? `Casados em ${formatDate(couple.weddingDate)}`
                        : "Data de casamento não informada"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {couple.hasWeddingDate ? (
                      <>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {marriageTime.years} anos, {marriageTime.months} meses
                        </Badge>
                        {daysUntilAnniversary !== null && daysUntilAnniversary <= 30 && (
                          <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                            {daysUntilAnniversary === 0
                              ? "Aniversário hoje!"
                              : daysUntilAnniversary === 1
                                ? "Aniversário amanhã!"
                                : `${daysUntilAnniversary} dias para aniversário`}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                        Data pendente
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCoupleClick(couple)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Detalhes
                </Button>
              </div>
            )
          })}
        </div>

        {couples.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum casal encontrado com os filtros aplicados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
