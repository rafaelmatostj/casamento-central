"use client"

import { Heart, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface TimelineProps {
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
}

export function Timeline({ couples, parseDate, calculateMarriageTime }: TimelineProps) {
  const couplesWithDate = couples.filter((couple) => couple.hasWeddingDate)
  const couplesWithoutDate = couples.filter((couple) => !couple.hasWeddingDate)

  const sortedCouplesWithDate = [...couplesWithDate].sort((a, b) => {
    const dateA = parseDate(a.weddingDate)
    const dateB = parseDate(b.weddingDate)
    if (!dateA || !dateB) return 0
    return dateA.getTime() - dateB.getTime()
  })

  const sortedCouples = [...sortedCouplesWithDate, ...couplesWithoutDate]

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString)
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getYearFromDate = (dateString: string) => {
    const date = parseDate(dateString)
    return date ? date.getFullYear() : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Linha do Tempo dos Casamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-pink-200 to-purple-200"></div>

          <div className="space-y-8">
            {sortedCouples.map((couple, index) => {
              const marriageTime = calculateMarriageTime(couple.weddingDate)
              const currentYears = marriageTime.years

              return (
                <div key={couple.id} className="relative flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 rounded-full shadow-lg ${
                      couple.hasWeddingDate ? "border-pink-200" : "border-gray-300"
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${couple.hasWeddingDate ? "text-pink-500" : "text-gray-400"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={couple.photo || "/placeholder.svg"}
                              alt={`${couple.husband} e ${couple.wife}`}
                            />
                            <AvatarFallback className="bg-pink-100 text-pink-600">
                              {couple.husband.charAt(0)}
                              {couple.wife.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              {couple.husband} & {couple.wife}
                            </h3>
                            <p className="text-gray-600">
                              {couple.hasWeddingDate
                                ? `Casaram em ${formatDate(couple.weddingDate)}`
                                : "Data de casamento não informada"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          {couple.hasWeddingDate ? (
                            <>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {getYearFromDate(couple.weddingDate)}
                              </Badge>
                              <div className="text-sm text-gray-500">{currentYears} anos juntos</div>
                            </>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                              Data pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        {sortedCouplesWithDate.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Resumo da Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Primeiro Casamento:</span>
                  <br />
                  {formatDate(sortedCouplesWithDate[0]?.weddingDate || "")}
                </div>
                <div>
                  <span className="font-medium">Último Casamento:</span>
                  <br />
                  {formatDate(sortedCouplesWithDate[sortedCouplesWithDate.length - 1]?.weddingDate || "")}
                </div>
                <div>
                  <span className="font-medium">Período Total:</span>
                  <br />
                  {getYearFromDate(sortedCouplesWithDate[sortedCouplesWithDate.length - 1]?.weddingDate || "") -
                    getYearFromDate(sortedCouplesWithDate[0]?.weddingDate || "")}{" "}
                  anos
                </div>
                <div>
                  <span className="font-medium">Sem Data:</span>
                  <br />
                  {couplesWithoutDate.length} casais
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
