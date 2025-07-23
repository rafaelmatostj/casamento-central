"use client"

import { useEffect, useState } from "react"
import { X, Heart, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Couple {
  id: number
  husband: string
  wife: string
  weddingDate: string
  photo: string
  hasWeddingDate: boolean
}

interface CoupleDetailsProps {
  couple: Couple
  parseDate: (dateString: string) => Date | null
  calculateMarriageTime: (weddingDate: string) => {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  onClose: () => void
}

export function CoupleDetails({ couple, parseDate, calculateMarriageTime, onClose }: CoupleDetailsProps) {
  const [marriageTime, setMarriageTime] = useState(calculateMarriageTime(couple.weddingDate))

  useEffect(() => {
    if (!couple.hasWeddingDate) return

    const interval = setInterval(() => {
      setMarriageTime(calculateMarriageTime(couple.weddingDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [couple.weddingDate, couple.hasWeddingDate, calculateMarriageTime])

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString)
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getNextAnniversary = () => {
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
    const yearsCompleting = nextAnniversary.getFullYear() - wedding.getFullYear()

    return { daysUntil, yearsCompleting, date: nextAnniversary }
  }

  const nextAnniversary = getNextAnniversary()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-4 pr-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={couple.photo ? `/photos/${couple.photo}` : "/photos/padrao.jpg"} alt={`${couple.husband} e ${couple.wife}`} />
              <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                {couple.husband.charAt(0)}
                {couple.wife.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {couple.husband} & {couple.wife}
              </CardTitle>
              {couple.hasWeddingDate && (
                <p className="text-gray-600 mt-1">Casados em {formatDate(couple.weddingDate)}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {couple.hasWeddingDate ? (
            <>
              {/* Tempo de Casamento em Tempo Real */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Tempo de Casamento</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">{marriageTime.years}</div>
                    <div className="text-sm text-gray-600">Anos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{marriageTime.months}</div>
                    <div className="text-sm text-gray-600">Meses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{marriageTime.days}</div>
                    <div className="text-sm text-gray-600">Dias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{marriageTime.hours}</div>
                    <div className="text-sm text-gray-600">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{marriageTime.minutes}</div>
                    <div className="text-sm text-gray-600">Minutos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{marriageTime.seconds}</div>
                    <div className="text-sm text-gray-600">Segundos</div>
                  </div>
                </div>
              </div>

              {/* Próximo Aniversário */}
              {nextAnniversary && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Próximo Aniversário</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-semibold">
                        {nextAnniversary.date.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Anos completando:</span>
                      <Badge className="bg-blue-100 text-blue-700">
                        {nextAnniversary.yearsCompleting}º aniversário
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Dias restantes:</span>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {nextAnniversary.daysUntil === 0
                          ? "Hoje!"
                          : nextAnniversary.daysUntil === 1
                            ? "Amanhã!"
                            : `${nextAnniversary.daysUntil} dias`}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Estatísticas Adicionais */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Estatísticas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de dias casados:</span>
                    <span className="font-semibold">
                      {Math.floor(
                        (new Date().getTime() - parseDate(couple.weddingDate)!.getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de horas:</span>
                    <span className="font-semibold">
                      {Math.floor(
                        (new Date().getTime() - parseDate(couple.weddingDate)!.getTime()) / (1000 * 60 * 60),
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de minutos:</span>
                    <span className="font-semibold">
                      {Math.floor(
                        (new Date().getTime() - parseDate(couple.weddingDate)!.getTime()) / (1000 * 60),
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de segundos:</span>
                    <span className="font-semibold">
                      {Math.floor(
                        (new Date().getTime() - parseDate(couple.weddingDate)!.getTime()) / 1000,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Data de Casamento Não Informada</h3>
              <p className="text-gray-500">Este casal ainda não tem a data de casamento cadastrada no sistema.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
