import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Resources() {
  const resources = [
    {
      title: 'National Suicide Prevention Lifeline',
      description: '24/7, free and confidential support for people in distress',
      phone: '1-800-273-8255',
      website: 'https://suicidepreventionlifeline.org/',
    },
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 to connect with a Crisis Counselor',
      phone: 'Text HOME to 741741',
      website: 'https://www.crisistextline.org/',
    },
    {
      title: 'SAMHSA National Helpline',
      description: 'Treatment referral and information service (in English and Spanish)',
      phone: '1-800-662-4357',
      website: 'https://www.samhsa.gov/find-help/national-helpline',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Mental Health Resources</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{resource.description}</p>
              <p className="mb-2">
                <strong>Phone:</strong> {resource.phone}
              </p>
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit Website
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



