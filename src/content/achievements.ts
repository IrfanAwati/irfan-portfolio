/** Certifications, honours and recommendations (all from LinkedIn). Append to extend. */

export const certifications = [
  {
    name: 'Microsoft Certified: Azure Administrator Associate',
    code: 'AZ-104',
    issuer: 'Microsoft',
    issued: 'Jul 2024',
    // LinkedIn lists an expiry of Jul 2025. Set to the renewal date if renewed.
    status: 'Issued Jul 2024',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
  },
  {
    name: 'Microsoft Azure Fundamentals',
    code: 'AZ-900',
    issuer: 'Microsoft',
    issued: 'Jan 2023',
    status: 'Issued Jan 2023',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
  },
  {
    name: 'Automating Administration with Windows PowerShell',
    code: 'PS',
    issuer: 'Udemy',
    issued: 'Feb 2023',
    status: 'Issued Feb 2023',
    url: '',
  },
]

export const honours = [
  { year: '2016', title: 'Smart Car Parking System, selected for Smart City implementation', by: 'LEAD Deshpande Foundation, Hubli · appreciated by Anousheh Ansari' },
  { year: '2016', title: '3rd place, national paper presentation: “Future Concept on Automobile”', by: 'C. B. Kore Polytechnic, Chikodi' },
  { year: '—', title: '1st place, national paper presentation: “Smart Automobiles”', by: 'C. B. Kore Polytechnic, Chikodi' },
  { year: '2015', title: 'National-level paper presentation', by: 'SJPN Trust’s Polytechnic, Nidasoshi' },
]

export const recommendation = {
  quote:
    'He tackled every assignment with professionalism and with a high degree of technical ability… a true team player, a quick learner… I would recommend Irfan if you are looking for a great addition to your DevOps team.',
  author: 'Doug Srofe',
  context: 'Led the DevOps group at Knipper, where Irfan worked as a contractor from Atlas Systems',
}
