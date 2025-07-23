"use client"

import { Heart, Calendar, Eye } from "lucide-react"

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
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Heart className="h-5 w-5 text-pink-500" />
        Lista de Casais ({couples.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {couples.map((couple) => {
          const daysUntilAnniversary = getNextAnniversary(couple)
          const marriageTime = calculateMarriageTime(couple.weddingDate)

          return (
            <div
              key={couple.id}
              className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={couple.photo ? `/photos/${couple.photo}` : "/photos/padrao.jpg"} alt={`${couple.husband} e ${couple.wife}`} />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl">
                  {couple.husband.charAt(0)}
                  {couple.wife.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-xl text-gray-800">
                  {couple.husband} & {couple.wife}
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {couple.hasWeddingDate
                    ? formatDate(couple.weddingDate)
                    : "Data não informada"}
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2">
                {couple.hasWeddingDate ? (
                  <>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3 text-xs">
                      {marriageTime.years}a, {marriageTime.months}m casados
                    </Badge>
                    {daysUntilAnniversary !== null && daysUntilAnniversary <= 30 && (
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200 py-1 px-3 text-xs">
                        {daysUntilAnniversary === 0
                          ? "Aniversário hoje!"
                          : daysUntilAnniversary === 1
                            ? "Aniversário amanhã!"
                            : `Faltam ${daysUntilAnniversary} dias`}
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 py-1 px-3 text-xs">
                    Data pendente
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onCoupleClick(couple)}
                className="w-full flex items-center justify-center gap-2 mt-4"
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
    </div>
  )
}
