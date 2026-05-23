/** 오시는 길 페이지 — 관별 주소·연락처·네이버 지도 (순서 고정) */
export type LocationCampus = {
  id: string;
  name: string;
  /** 푸터 관 카드 제목 */
  footerName: string;
  address: string;
  phone: { display: string; tel: string };
  /** 네이버 지도 장소 페이지 (새 탭) */
  naverMapUrl: string;
  /** Google Maps iframe 검색어 (주소·관 이름 기준) */
  mapQuery: string;
  coordinates: { lat: number; lng: number };
};

export const LOCATION_CAMPUSES: readonly LocationCampus[] = [
  {
    id: "foreign-p",
    name: "외고 P관",
    footerName: "P(프리미엄)관",
    address: "강남구 도곡로77길 14 양지빌딩, 2층",
    phone: { display: "02-562-8787", tel: "02-562-8787" },
    naverMapUrl:
      "https://map.naver.com/p/entry/place/1996752971?placePath=%2Fhome&searchType=place&lng=127.0585517&lat=37.4993134",
    mapQuery: "서울특별시 강남구 도곡로77길 14 양지빌딩 대치위더스 P관",
    coordinates: { lat: 37.4993134, lng: 127.0585517 },
  },
  {
    id: "foreign-m",
    name: "외고 M관",
    footerName: "M관",
    address: "강남구 도곡로77길 5 유성빌딩, 2·3층",
    phone: { display: "02-562-5757", tel: "02-562-5757" },
    naverMapUrl:
      "https://map.naver.com/p/entry/place/1174818993?placePath=/home?entry=pll&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605170236&locale=ko&svcName=map_pcv5&searchType=place&lng=127.0583849&lat=37.4986565&c=15.00,0,0,0,dh",
    mapQuery: "서울특별시 강남구 도곡로77길 5 유성빌딩 대치위더스 M관",
    coordinates: { lat: 37.4986565, lng: 127.0583849 },
  },
  {
    id: "foreign-s",
    name: "외고 S관",
    footerName: "S관",
    address: "강남구 대치동 929-11",
    phone: { display: "02-562-8787", tel: "02-562-8787" },
    naverMapUrl:
      "https://map.naver.com/p/search/%EB%8C%80%EC%B9%98%EC%9C%84%EB%8D%94%EC%8A%A4%20S%EA%B4%80?c=15.00,127.0656600,37.4988200,0,0,dh",
    mapQuery: "서울특별시 강남구 대치동 929-11 대치위더스 S관",
    coordinates: { lat: 37.49882, lng: 127.06566 },
  },
  {
    id: "admissions",
    name: "입시관",
    footerName: "입시관",
    address: "강남구 도곡로77길 5 유성빌딩, 3층",
    phone: { display: "02-562-5759", tel: "02-562-5759" },
    naverMapUrl:
      "https://map.naver.com/p/entry/place/1883947519?placePath=/home?entry=pll&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605170237&locale=ko&svcName=map_pcv5&searchType=place&lng=127.0583849&lat=37.4986565&c=15.00,0,0,0,dh",
    mapQuery: "서울특별시 강남구 도곡로77길 5 유성빌딩 대치위더스 입시관",
    coordinates: { lat: 37.4986565, lng: 127.0583849 },
  },
] as const;

/** Google Maps iframe 임베드 — 관별 주소·이름으로 검색 */
export function googleMapEmbedSrc(
  campus: Pick<LocationCampus, "mapQuery">,
): string {
  const q = encodeURIComponent(campus.mapQuery);
  return `https://maps.google.com/maps?q=${q}&hl=ko&z=17&output=embed`;
}
