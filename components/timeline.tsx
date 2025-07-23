"use client"

import { Heart, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  onCoupleClick: (couple: Couple) => void
}

export function Timeline({ couples, parseDate, calculateMarriageTime, onCoupleClick }: TimelineProps) {
  const couplesWithDate = couples
    .filter((couple) => couple.hasWeddingDate)
    .sort((a, b) => {
      const dateA = parseDate(a.weddingDate)
      const dateB = parseDate(b.weddingDate)
      if (!dateA || !dateB) return 0
      return dateA.getTime() - dateB.getTime()
    })

  const couplesWithoutDate = couples.filter((couple) => !couple.hasWeddingDate)

  const getYearFromDate = (dateString: string) => {
    const date = parseDate(dateString)
    return date ? date.getFullYear() : 0
  }

  const couplesByYear = couplesWithDate.reduce(
    (acc, couple) => {
      const year = getYearFromDate(couple.weddingDate)
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(couple)
      return acc
    },
    {} as Record<number, Couple[]>,
  )

  const sortedYears = Object.keys(couplesByYear)
    .map(Number)
    .sort((a, b) => a - b)

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString)
    if (!date) return ""
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-10">
      {sortedYears.map((year) => (
        <div key={year}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            <h3 className="text-2xl font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full shadow-sm">
              {year}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {couplesByYear[year].map((couple) => {
              const marriageTime = calculateMarriageTime(couple.weddingDate)
              const currentYears = marriageTime.years
              return (
                <div
                  key={couple.id}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => onCoupleClick(couple)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage
                        src={couple.photo ? `/photos/${couple.photo}` : "/photos/padrao.jpg"}
                        alt={`${couple.husband} e ${couple.wife}`}
                      />
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {couple.husband.charAt(0)}
                        {couple.wife.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">
                        {couple.husband} & {couple.wife}
                      </h4>
                      <p className="text-sm text-gray-500">{formatDate(couple.weddingDate)}</p>
                      <Badge
                        variant="outline"
                        className="mt-2 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {currentYears} anos
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {couplesWithoutDate.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <h3 className="text-xl font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full shadow-sm">
              Datas Pendentes
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {couplesWithoutDate.map((couple) => (
              <div
                key={couple.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 opacity-80"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage
                      src={couple.photo ? `/photos/${couple.photo}` : "/photos/padrao.jpg"}
                      alt={`${couple.husband} e ${couple.wife}`}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {couple.husband.charAt(0)}
                      {couple.wife.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">
                      {couple.husband} & {couple.wife}
                    </h4>
                    <p className="text-sm text-gray-500">Data não informada</p>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-gray-50 text-gray-600 border-gray-300"
                    >
                      Pendente
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {couplesWithDate.length > 0 && (
        <div className="mt-12 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Resumo da Timeline</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-purple-800">Primeiro Casamento</p>
              <p className="text-gray-600">{formatDate(couplesWithDate[0]?.weddingDate || "")}</p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Último Casamento</p>
              <p className="text-gray-600">
                {formatDate(couplesWithDate[couplesWithDate.length - 1]?.weddingDate || "")}
              </p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Total de Casais</p>
              <p className="text-gray-600">{couplesWithDate.length} com data</p>
            </div>
            <div>
              <p className="font-medium text-purple-800">Datas Pendentes</p>
              <p className="text-gray-600">{couplesWithoutDate.length} casais</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
