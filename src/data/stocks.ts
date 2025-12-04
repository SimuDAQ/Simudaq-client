export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
  description: string;
  high52w: number;
  low52w: number;
  per: number;
  pbr: number;
  eps: number;
  dividend: number;
}

export const stocks: Stock[] = [
  {
    code: "005930",
    name: "삼성전자",
    price: 71500,
    change: 1200,
    changePercent: 1.71,
    volume: 12543000,
    marketCap: "426조",
    sector: "전기전자",
    description: "삼성전자는 대한민국의 대표적인 전자제품 제조 기업으로, 반도체, 스마트폰, 디스플레이, 가전제품 등을 생산합니다. 세계 최대의 메모리 반도체 제조사이자 스마트폰 시장 점유율 1위 기업입니다.",
    high52w: 87800,
    low52w: 53000,
    per: 13.2,
    pbr: 1.1,
    eps: 5417,
    dividend: 2.8,
  },
  {
    code: "000660",
    name: "SK하이닉스",
    price: 178000,
    change: -2500,
    changePercent: -1.39,
    volume: 3421000,
    marketCap: "129조",
    sector: "전기전자",
    description: "SK하이닉스는 DRAM과 NAND 플래시 메모리를 생산하는 세계적인 반도체 기업입니다. AI와 데이터센터 수요 증가로 HBM(고대역폭 메모리) 시장을 선도하고 있습니다.",
    high52w: 219500,
    low52w: 110000,
    per: 8.5,
    pbr: 1.8,
    eps: 20941,
    dividend: 1.2,
  },
  {
    code: "035420",
    name: "NAVER",
    price: 215000,
    change: 3500,
    changePercent: 1.65,
    volume: 876000,
    marketCap: "35조",
    sector: "서비스업",
    description: "네이버는 대한민국 1위 포털 사이트를 운영하는 IT 기업으로, 검색, 커머스, 핀테크, 콘텐츠, 클라우드 등 다양한 사업을 영위합니다. 일본 라인을 통해 글로벌 메신저 시장에도 진출해 있습니다.",
    high52w: 240000,
    low52w: 165000,
    per: 25.3,
    pbr: 1.4,
    eps: 8498,
    dividend: 0.5,
  },
  {
    code: "035720",
    name: "카카오",
    price: 42500,
    change: -800,
    changePercent: -1.85,
    volume: 2341000,
    marketCap: "19조",
    sector: "서비스업",
    description: "카카오는 국민 메신저 카카오톡을 기반으로 다양한 플랫폼 서비스를 제공하는 IT 기업입니다. 게임, 금융, 모빌리티, 콘텐츠 등 다양한 사업 분야로 확장하고 있습니다.",
    high52w: 68000,
    low52w: 35000,
    per: 45.2,
    pbr: 1.2,
    eps: 940,
    dividend: 0.2,
  },
  {
    code: "051910",
    name: "LG화학",
    price: 385000,
    change: 8500,
    changePercent: 2.26,
    volume: 432000,
    marketCap: "27조",
    sector: "화학",
    description: "LG화학은 석유화학, 첨단소재, 생명과학 사업을 영위하는 종합 화학 기업입니다. 전기차 배터리 사업부인 LG에너지솔루션을 자회사로 두고 있습니다.",
    high52w: 520000,
    low52w: 310000,
    per: 18.7,
    pbr: 1.0,
    eps: 20588,
    dividend: 1.5,
  },
  {
    code: "006400",
    name: "삼성SDI",
    price: 412000,
    change: 5000,
    changePercent: 1.23,
    volume: 287000,
    marketCap: "28조",
    sector: "전기전자",
    description: "삼성SDI는 2차전지와 전자재료를 생산하는 기업입니다. 전기차용 배터리와 에너지저장장치(ESS) 시장에서 글로벌 경쟁력을 보유하고 있습니다.",
    high52w: 550000,
    low52w: 350000,
    per: 22.1,
    pbr: 1.3,
    eps: 18643,
    dividend: 0.8,
  },
  {
    code: "055550",
    name: "신한지주",
    price: 51200,
    change: 400,
    changePercent: 0.79,
    volume: 1234000,
    marketCap: "26조",
    sector: "금융업",
    description: "신한지주는 신한은행, 신한카드, 신한금융투자 등을 자회사로 둔 대한민국 대표 금융지주회사입니다. 리테일과 기업금융 모두에서 강점을 보이고 있습니다.",
    high52w: 58000,
    low52w: 38000,
    per: 6.8,
    pbr: 0.5,
    eps: 7529,
    dividend: 5.2,
  },
  {
    code: "105560",
    name: "KB금융",
    price: 78500,
    change: 1200,
    changePercent: 1.55,
    volume: 876000,
    marketCap: "32조",
    sector: "금융업",
    description: "KB금융은 KB국민은행을 핵심 자회사로 둔 국내 최대 금융지주회사입니다. 은행, 증권, 보험, 카드 등 종합 금융 서비스를 제공합니다.",
    high52w: 85000,
    low52w: 52000,
    per: 7.2,
    pbr: 0.6,
    eps: 10903,
    dividend: 4.8,
  },
  {
    code: "068270",
    name: "셀트리온",
    price: 185000,
    change: -3200,
    changePercent: -1.70,
    volume: 654000,
    marketCap: "24조",
    sector: "의약품",
    description: "셀트리온은 바이오시밀러(바이오의약품 복제약) 분야의 글로벌 선두 기업입니다. 램시마, 트룩시마 등 블록버스터 바이오시밀러를 개발하여 전 세계에 공급하고 있습니다.",
    high52w: 220000,
    low52w: 130000,
    per: 35.4,
    pbr: 2.8,
    eps: 5226,
    dividend: 0.3,
  },
  {
    code: "028260",
    name: "삼성물산",
    price: 142000,
    change: 2000,
    changePercent: 1.43,
    volume: 345000,
    marketCap: "27조",
    sector: "유통업",
    description: "삼성물산은 건설, 상사, 패션, 리조트 사업을 영위하는 삼성그룹의 지주회사적 성격을 가진 기업입니다. 삼성전자, 삼성생명 등 주요 계열사 지분을 보유하고 있습니다.",
    high52w: 175000,
    low52w: 110000,
    per: 14.5,
    pbr: 0.8,
    eps: 9793,
    dividend: 2.1,
  },
];

// Generate mock price history data
export function generatePriceHistory(basePrice: number, days: number = 90): { date: string; price: number; volume: number }[] {
  const history = [];
  let currentPrice = basePrice * 0.85;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.48) * (basePrice * 0.03);
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7);
    currentPrice = Math.min(currentPrice, basePrice * 1.3);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      volume: Math.round(Math.random() * 10000000) + 1000000,
    });
  }
  
  return history;
}
