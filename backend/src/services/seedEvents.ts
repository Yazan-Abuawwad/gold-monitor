import db from '../db/client.js';

const sampleEvents = [
  {
    title: 'Ukraine-Russia Conflict Zone',
    description: 'Ongoing military operations in eastern Ukraine. Frontline activity reported near Zaporizhzhia.',
    lat: 48.37,
    lng: 31.16,
    event_type: 'conflict',
    severity: 'critical',
    source: 'Defense Monitor',
  },
  {
    title: 'Middle East Tensions — West Bank',
    description: 'Heightened security operations in the West Bank. Multiple incidents reported.',
    lat: 31.77,
    lng: 35.21,
    event_type: 'conflict',
    severity: 'high',
    source: 'Al Jazeera',
  },
  {
    title: 'Taiwan Strait Activity',
    description: 'PLA naval exercises reported near the Taiwan Strait. Regional tensions elevated.',
    lat: 25.04,
    lng: 121.56,
    event_type: 'military',
    severity: 'high',
    source: 'Reuters',
  },
  {
    title: 'Sudan — Khartoum Conflict',
    description: 'Ongoing armed conflict between SAF and RSF forces in and around Khartoum.',
    lat: 15.55,
    lng: 32.53,
    event_type: 'conflict',
    severity: 'critical',
    source: 'BBC World',
  },
  {
    title: 'South China Sea Dispute',
    description: 'Territorial disputes continue in the South China Sea. Naval patrols increased.',
    lat: 14.5,
    lng: 114.0,
    event_type: 'military',
    severity: 'high',
    source: 'Reuters',
  },
  {
    title: 'North Korea — Missile Activity',
    description: 'Satellite imagery suggests increased activity at North Korean missile facilities.',
    lat: 39.0,
    lng: 127.5,
    event_type: 'military',
    severity: 'high',
    source: 'Defense News',
  },
  {
    title: 'India-Pakistan Border Tension',
    description: 'Cross-border incidents reported along the Line of Control in Kashmir.',
    lat: 30.37,
    lng: 73.06,
    event_type: 'conflict',
    severity: 'medium',
    source: 'Reuters',
  },
  {
    title: 'Venezuela — Political Unrest',
    description: 'Post-election political crisis continues. International pressure mounting on Maduro government.',
    lat: 10.48,
    lng: -66.87,
    event_type: 'political',
    severity: 'medium',
    source: 'AP News',
  },
  {
    title: 'Syria — Ongoing Instability',
    description: 'Continued instability in northern Syria. Drone strikes reported near Aleppo.',
    lat: 33.51,
    lng: 36.29,
    event_type: 'conflict',
    severity: 'high',
    source: 'Al Jazeera',
  },
  {
    title: 'Ethiopia — Tigray Region',
    description: 'Humanitarian situation remains dire in the Tigray region. Aid access limited.',
    lat: 14.03,
    lng: 38.74,
    event_type: 'humanitarian',
    severity: 'medium',
    source: 'BBC World',
  },
  {
    title: 'Iran — Nuclear Tensions',
    description: 'IAEA reports accelerated uranium enrichment activities at Natanz facility.',
    lat: 33.69,
    lng: 51.42,
    event_type: 'political',
    severity: 'high',
    source: 'Reuters',
  },
  {
    title: 'Myanmar — Civil War',
    description: 'Resistance forces gain ground in Shan State. Military junta intensifies airstrikes.',
    lat: 19.76,
    lng: 96.08,
    event_type: 'conflict',
    severity: 'high',
    source: 'BBC World',
  },
  {
    title: 'Haiti — Gang Violence',
    description: 'Gang violence paralyzes Port-au-Prince. International security mission deployment delayed.',
    lat: 18.54,
    lng: -72.34,
    event_type: 'security',
    severity: 'critical',
    source: 'AP News',
  },
  {
    title: 'Niger — Political Crisis',
    description: 'Military junta expels French forces. Regional ECOWAS tensions remain elevated.',
    lat: 13.51,
    lng: 2.12,
    event_type: 'political',
    severity: 'medium',
    source: 'The Guardian World',
  },
  {
    title: 'Gaza — Humanitarian Crisis',
    description: 'Severe humanitarian crisis continues. International aid efforts face access challenges.',
    lat: 31.35,
    lng: 34.31,
    event_type: 'humanitarian',
    severity: 'critical',
    source: 'Al Jazeera',
  },
  {
    title: 'Red Sea — Shipping Disruptions',
    description: 'Houthi attacks continue to disrupt Red Sea shipping lanes. Rerouting via Cape of Good Hope.',
    lat: 15.55,
    lng: 42.55,
    event_type: 'security',
    severity: 'high',
    source: 'Reuters',
  },
];

export function seedMapEvents(): void {
  const count = (db.prepare('SELECT COUNT(*) as count FROM map_events').get() as { count: number }).count;
  if (count > 0) {
    console.log(`ℹ️  Map events already seeded (${count} events). Skipping.`);
    return;
  }

  const insert = db.prepare(`
    INSERT INTO map_events (title, description, lat, lng, event_type, severity, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction(() => {
    for (const event of sampleEvents) {
      insert.run(event.title, event.description, event.lat, event.lng, event.event_type, event.severity, event.source);
    }
  });

  insertAll();
  console.log(`✅ Seeded ${sampleEvents.length} map events`);
}
