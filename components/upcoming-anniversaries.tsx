"use client"
import { Gift, Calendar, Heart, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Couple {
  id: number
  husband: string
  wife: string
  weddingDate: string
  yearsMarried: number
  photo: string
  hasWeddingDate: boolean
}

interface UpcomingAnniversariesProps {
  couples: Couple[]
  parseDate: (dateString: string) => Date | null
}

export function UpcomingAnniversaries({ couples, parseDate }: UpcomingAnniversariesProps) {
  const today = new Date()

  const getAnniversaryInfo = (couple: Couple) => {
    if (!couple.hasWeddingDate) {
      return {
        daysUntil: Number.POSITIVE_INFINITY,
        yearsCompleting: 0,
        date: new Date(),
        isToday: false,
        isTomorrow: false,
        isThisWeek: false,
        isThisMonth: false,
        hasDate: false,
      }
    }

    const weddingDate = parseDate(couple.weddingDate)
    if (!weddingDate)
      return {
        daysUntil: Number.POSITIVE_INFINITY,
        yearsCompleting: 0,
        date: new Date(),
        isToday: false,
        isTomorrow: false,
        isThisWeek: false,
        isThisMonth: false,
        hasDate: false,
      }

    const thisYear = today.getFullYear()
    const nextAnniversary = new Date(thisYear, weddingDate.getMonth(), weddingDate.getDate())

    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(thisYear + 1)
    }

    const daysUntil = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const yearsCompleting = nextAnniversary.getFullYear() - weddingDate.getFullYear()

    return {
      daysUntil,
      yearsCompleting,
      date: nextAnniversary,
      isToday: daysUntil === 0,
      isTomorrow: daysUntil === 1,
      isThisWeek: daysUntil <= 7,
      isThisMonth: weddingDate.getMonth() === today.getMonth(),
      hasDate: true,
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    })
  }

  const couplesWithAnniversaryInfo = couples
    .filter((couple) => couple.hasWeddingDate)
    .map((couple) => ({
      ...couple,
      anniversaryInfo: getAnniversaryInfo(couple),
    }))

  const thisMonthAnniversaries = couplesWithAnniversaryInfo
    .filter((c) => c.anniversaryInfo.isThisMonth)
    .sort((a, b) => a.anniversaryInfo.daysUntil - b.anniversaryInfo.daysUntil)

  const upcomingAnniversaries = couplesWithAnniversaryInfo
    .filter((c) => !c.anniversaryInfo.isThisMonth && c.anniversaryInfo.daysUntil > 0)
    .sort((a, b) => a.anniversaryInfo.daysUntil - b.anniversaryInfo.daysUntil)

  const AnniversaryCard = ({ couple, isPending = false }: { couple: any; isPending?: boolean }) => (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow">
      <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
        <AvatarImage src={couple.photo ? `/photos/${couple.photo}` : "/photos/padrao.jpg"} alt={`${couple.husband} e ${couple.wife}`} />
        <AvatarFallback className={isPending ? "bg-gray-100 text-gray-600" : "bg-pink-100 text-pink-600"}>
          {couple.husband.charAt(0)}
          {couple.wife.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1 min-w-0">
        <h3 className="font-semibold text-base truncate">
          {couple.husband} & {couple.wife}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isPending ? (
            <span>Data não informada</span>
          ) : (
            <>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(couple.anniversaryInfo.date)}</span>
            </>
          )}
        </div>
      </div>

      {!isPending && (
        <div className="text-right">
          <div className="font-bold text-sm sm:text-base text-pink-600">
            {couple.anniversaryInfo.yearsCompleting} anos
          </div>
          <div className="text-xs text-gray-500">
            {couple.anniversaryInfo.isToday ? (
              <span className="text-red-500 font-semibold">É hoje!</span>
            ) : (
              <span>em {couple.anniversaryInfo.daysUntil} dias</span>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Tabs defaultValue="month" className="w-full">
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger value="month" className="relative">
          Este Mês
          {thisMonthAnniversaries.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500">
              {thisMonthAnniversaries.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Próximos
          {upcomingAnniversaries.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-purple-500">
              {upcomingAnniversaries.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="month">
        {thisMonthAnniversaries.length > 0 ? (
          <div className="space-y-4">
            {thisMonthAnniversaries.map((couple) => <AnniversaryCard key={couple.id} couple={couple} />)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum aniversário este mês.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="upcoming">
        {upcomingAnniversaries.length > 0 ? (
          <div className="space-y-4">
            {upcomingAnniversaries.map((couple) => <AnniversaryCard key={couple.id} couple={couple} />)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum aniversário nos próximos meses.</p>
          </div>
        )}
      </TabsContent>

    </Tabs>
  )
}
