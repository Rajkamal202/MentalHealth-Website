import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { toast } from 'react-hot-toast'

export default function Reports() {
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCheckIn, setSelectedCheckIn] = useState(null)

  useEffect(() => {
    fetchCheckIns()
  }, [])

  const fetchCheckIns = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/check-in`)
      setCheckIns(response.data.checkIns)
    } catch (error) {
      console.error('Error fetching check-ins:', error)
      toast.error('Failed to fetch check-ins')
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊'
    if (mood >= 3) return '😐'
    return '😔'
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Check-in History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Stress Level</TableHead>
                    <TableHead>Journal Entry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkIns.map((checkIn) => (
                    <TableRow key={checkIn._id}>
                      <TableCell>
                        {format(new Date(checkIn.createdAt), 'PPP')}
                      </TableCell>
                      <TableCell>
                        {getMoodEmoji(checkIn.mood)} ({checkIn.mood}/5)
                      </TableCell>
                      <TableCell>{checkIn.stressLevel}/5</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {checkIn.journal}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedCheckIn(checkIn)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedCheckIn && (
          <Card>
            <CardHeader>
              <CardTitle>Check-in Details</CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(selectedCheckIn.createdAt), 'PPP')}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Mood</h3>
                <p>
                  {getMoodEmoji(selectedCheckIn.mood)} ({selectedCheckIn.mood}/5)
                </p>
              </div>
              <div>
                <h3 className="font-medium">Stress Level</h3>
                <p>{selectedCheckIn.stressLevel}/5</p>
              </div>
              <div>
                <h3 className="font-medium">Journal Entry</h3>
                <p className="whitespace-pre-wrap">{selectedCheckIn.journal}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedCheckIn(null)}
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



