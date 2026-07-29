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
  /** 관별 정적 지도 이미지 (`public/location/` 하위) */
  mapImageSrc: string;
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
    mapImageSrc: "/location/map-foreign-p.png",
  },
  {
    id: "foreign-m",
    name: "외고 M관",
    footerName: "M관",
    address: "강남구 도곡로77길 5 유성빌딩, 2·3층",
    phone: { display: "02-562-5757", tel: "02-562-5757" },
    naverMapUrl:
      "https://map.naver.com/p/entry/place/1174818993?placePath=/home?entry=pll&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605170236&locale=ko&svcName=map_pcv5&searchType=place&lng=127.0583849&lat=37.4986565&c=15.00,0,0,0,dh",
    mapImageSrc: "/location/map-foreign-m.png",
  },
  {
    id: "foreign-s",
    name: "외고 S관",
    footerName: "S관",
    address: "대치동 929-11, 대치빌딩 1층",
    phone: { display: "02-562-8787", tel: "02-562-8787" },
    naverMapUrl: "https://naver.me/5jXXy38l",
    mapImageSrc: "/location/map-foreign-s.png",
  },
  {
    id: "admissions",
    name: "입시관",
    footerName: "입시관",
    address: "강남구 도곡로77길 5 유성빌딩, 3층",
    phone: { display: "02-562-5759", tel: "02-562-5759" },
    naverMapUrl:
      "https://map.naver.com/p/entry/place/1883947519?placePath=/home?entry=pll&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605170237&locale=ko&svcName=map_pcv5&searchType=place&lng=127.0583849&lat=37.4986565&c=15.00,0,0,0,dh",
    mapImageSrc: "/location/map-admissions.png",
  },
] as const;
