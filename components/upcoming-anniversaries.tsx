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
      isThisMonth: daysUntil <= 30,
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

  const todayAnniversaries = couplesWithAnniversaryInfo.filter((c) => c.anniversaryInfo.isToday)
  const thisWeekAnniversaries = couplesWithAnniversaryInfo.filter(
    (c) => c.anniversaryInfo.isThisWeek && !c.anniversaryInfo.isToday,
  )
  const thisMonthAnniversaries = couplesWithAnniversaryInfo.filter(
    (c) => c.anniversaryInfo.isThisMonth && !c.anniversaryInfo.isThisWeek,
  )
  const upcomingAnniversaries = couplesWithAnniversaryInfo
    .filter((c) => c.anniversaryInfo.daysUntil <= 90 && !c.anniversaryInfo.isThisMonth)
    .sort((a, b) => a.anniversaryInfo.daysUntil - b.anniversaryInfo.daysUntil)

  const AnniversaryCard = ({ couple }: { couple: any }) => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar className="h-14 w-14">
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
            {formatDate(couple.anniversaryInfo.date)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {couple.anniversaryInfo.yearsCompleting}º aniversário
          </Badge>
          {couple.anniversaryInfo.isToday && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              <Gift className="h-3 w-3 mr-1" />
              Hoje!
            </Badge>
          )}
          {couple.anniversaryInfo.isTomorrow && (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">Amanhã</Badge>
          )}
          {!couple.anniversaryInfo.isToday && !couple.anniversaryInfo.isTomorrow && (
            <Badge variant="secondary">{couple.anniversaryInfo.daysUntil} dias</Badge>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-500" />
          Próximos Aniversários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today" className="relative">
              Hoje
              {todayAnniversaries.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                  {todayAnniversaries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="week" className="relative">
              Esta Semana
              {thisWeekAnniversaries.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-orange-500">
                  {thisWeekAnniversaries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="month" className="relative">
              Este Mês
              {thisMonthAnniversaries.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500">
                  {thisMonthAnniversaries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="no-date" className="relative">
              Sem Data
              {couples.filter((c) => !c.hasWeddingDate).length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-gray-500">
                  {couples.filter((c) => !c.hasWeddingDate).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayAnniversaries.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                    <Gift className="h-5 w-5" />
                    Aniversários de Hoje! 🎉
                  </div>
                </div>
                {todayAnniversaries.map((couple) => (
                  <AnniversaryCard key={couple.id} couple={couple} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum aniversário hoje.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            {thisWeekAnniversaries.length > 0 ? (
              thisWeekAnniversaries.map((couple) => <AnniversaryCard key={couple.id} couple={couple} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum aniversário esta semana.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            {thisMonthAnniversaries.length > 0 ? (
              thisMonthAnniversaries.map((couple) => <AnniversaryCard key={couple.id} couple={couple} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum aniversário este mês.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAnniversaries.length > 0 ? (
              upcomingAnniversaries.map((couple) => <AnniversaryCard key={couple.id} couple={couple} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum aniversário nos próximos meses.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="no-date" className="space-y-4">
            {couples.filter((c) => !c.hasWeddingDate).length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Calendar className="h-5 w-5" />
                    Casais sem Data de Casamento
                  </div>
                  <p className="text-sm text-gray-600">
                    Estes casais ainda não têm a data de casamento cadastrada no sistema.
                  </p>
                </div>
                {couples
                  .filter((c) => !c.hasWeddingDate)
                  .map((couple) => (
                    <div
                      key={couple.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src={couple.photo || "/placeholder.svg"}
                          alt={`${couple.husband} e ${couple.wife}`}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
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
                            Data de casamento não informada
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                            Pendente
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Todos os casais têm data de casamento cadastrada.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
