import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, UTCTimestamp } from "lightweight-charts";
import { cn } from "@/lib/utils";
import { chartService } from "@/services/chartService";
import { ChartData } from "@/types/chart";

interface StockChartProps {
  stockCode: string;
  basePrice: number;
  change: number;
}

const periodGroups = [
  {
    label: "분",
    options: [
      { label: "1분", interval: "min:1", initialCount: 60 },
      { label: "3분", interval: "min:3", initialCount: 60 },
      { label: "5분", interval: "min:5", initialCount: 60 },
      { label: "10분", interval: "min:10", initialCount: 60 },
      { label: "15분", interval: "min:15", initialCount: 50 },
      { label: "30분", interval: "min:30", initialCount: 50 },
      { label: "60분", interval: "min:60", initialCount: 50 },
    ],
  },
  {
    label: "일",
    options: [
      { label: "일봉", interval: "day:1", initialCount: 60 },
    ],
  },
  {
    label: "주",
    options: [{ label: "주봉", interval: "week:1", initialCount: 52 }],
  },
  {
    label: "월",
    options: [{ label: "월봉", interval: "month:1", initialCount: 24 }],
  },
  {
    label: "년",
    options: [{ label: "년봉", interval: "year:1", initialCount: 10 }],
  },
];

type ChartType = 'candlestick' | 'area' | 'line';

const StockChart = ({ stockCode, basePrice, change }: StockChartProps) => {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(1); // 일 default
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0); // 일봉 default
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('candlestick'); // 캔들스틱이 기본
  const [isChartTypeDropdownOpen, setIsChartTypeDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<any>(null); // 여러 타입의 series를 담을 수 있도록
  const nextDateTimeRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const shouldLoadMoreRef = useRef(false);
  const isInitialLoadRef = useRef(true); // 초기 로드 여부 추적

  const isPositive = change >= 0;
  const selectedOption = periodGroups[selectedGroupIndex].options[selectedOptionIndex];

  // 과거 데이터를 추가로 로드하는 함수
  const loadMoreData = async () => {
    if (isLoadingRef.current || !nextDateTimeRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const response = await chartService.getChart({
        stockCode,
        interval: selectedOption.interval,
        from: nextDateTimeRef.current,
        count: selectedOption.initialCount.toString(),
      });

      // nextDateTime 업데이트
      nextDateTimeRef.current = response.nextDateTime;

      // 중복 제거하면서 데이터 병합
      setChartData(prev => {
        const newData = response.candles.filter(
          newCandle => !prev.some(existingCandle => existingCandle.dateTime === newCandle.dateTime)
        );

        return [...prev, ...newData].sort((a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );
      });

      // 더 로드할 데이터가 있으면 계속 로드
      if (shouldLoadMoreRef.current && response.nextDateTime) {
        setTimeout(() => {
          loadMoreData();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to load more data:", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  };

  // 초기 데이터 로드
  const loadInitialData = async () => {
    setLoading(true);
    setChartData([]);
    nextDateTimeRef.current = null;
    isLoadingRef.current = true;
    isInitialLoadRef.current = true; // 초기 로드 플래그 설정

    try {
      // Asia/Seoul 시간대로 현재 시간 가져오기
      const now = new Date();
      const kstTimeStr = now.toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // "MM/DD/YYYY, HH:mm:ss" 형식을 "YYYY-MM-DDTHH:mm:ss"로 변환
      const [datePart, timePart] = kstTimeStr.split(', ');
      const [month, day, year] = datePart.split('/');
      const fromDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;

      const response = await chartService.getChart({
        stockCode,
        interval: selectedOption.interval,
        from: fromDate,
        count: selectedOption.initialCount.toString(),
      });

      setChartData(response.candles);
      nextDateTimeRef.current = response.nextDateTime;
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setChartData([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockCode, selectedGroupIndex, selectedOptionIndex]);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71717a",
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      grid: {
        vertLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        horzLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true, // 모든 interval에서 시간 표시
        secondsVisible: false,
        shiftVisibleRangeOnNewBar: false,
      },
      localization: {
        timeFormatter: (timestamp: number) => {
          // timestamp를 그대로 표시 (이미 KST 기준)
          const date = new Date(timestamp * 1000);
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          const hour = String(date.getUTCHours()).padStart(2, '0');
          const minute = String(date.getUTCMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hour}:${minute}`;
        },
      },
    });

    chartInstanceRef.current = chart;

    // 차트 타입에 따라 시리즈 생성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newSeries: any;
    if (chartType === 'candlestick') {
      newSeries = chart.addCandlestickSeries({
        upColor: '#3b82f6', // 파란색
        downColor: '#ef4444', // 빨간색
        borderUpColor: '#3b82f6',
        borderDownColor: '#ef4444',
        wickUpColor: '#3b82f6',
        wickDownColor: '#ef4444',
      });
    } else if (chartType === 'area') {
      newSeries = chart.addAreaSeries({
        lineColor: isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
        topColor: isPositive ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
        bottomColor: isPositive ? "rgba(34, 197, 94, 0)" : "rgba(239, 68, 68, 0)",
        lineWidth: 2,
      });
    } else {
      newSeries = chart.addLineSeries({
        color: isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
        lineWidth: 2,
      });
    }
    seriesRef.current = newSeries;

    // 차트 타입 변경 시에는 데이터를 설정하지 않음 (새 데이터 로드 대기)
    // 데이터는 useEffect의 chartData 변경 시점에 설정됨

    // 차트 타임스케일에서 가시 범위 변경 이벤트 리스너
    const timeScale = chart.timeScale();
    const handleVisibleLogicalRangeChange = () => {
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (!logicalRange) return;

      const rangeSize = logicalRange.to - logicalRange.from;

      // 최소 줌 인 제한 (최소 5개 캔들은 보이도록)
      const minVisibleBars = 5;
      if (rangeSize < minVisibleBars) {
        const center = (logicalRange.from + logicalRange.to) / 2;
        timeScale.setVisibleLogicalRange({
          from: center - minVisibleBars / 2,
          to: center + minVisibleBars / 2,
        });
        return;
      }

      // 최대 줌 아웃 제한 (interval별로 다르게 설정)
      let maxVisibleBars: number;
      if (selectedOption.interval.startsWith('min:')) {
        maxVisibleBars = 200; // 분봉: 최대 200개 캔들
      } else if (selectedOption.interval.startsWith('day:')) {
        maxVisibleBars = 180; // 일봉: 최대 180개 캔들 (약 6개월)
      } else if (selectedOption.interval.startsWith('week:')) {
        maxVisibleBars = 104; // 주봉: 최대 104개 캔들 (약 2년)
      } else if (selectedOption.interval.startsWith('month:')) {
        maxVisibleBars = 60; // 월봉: 최대 60개 캔들 (약 5년)
      } else {
        maxVisibleBars = 20; // 년봉: 최대 20개 캔들
      }

      if (rangeSize > maxVisibleBars) {
        const center = (logicalRange.from + logicalRange.to) / 2;
        timeScale.setVisibleLogicalRange({
          from: center - maxVisibleBars / 2,
          to: center + maxVisibleBars / 2,
        });
        // 최대 줌 아웃 시에도 데이터 로드 확인은 계속 진행
      }

      // 왼쪽 끝에 가까워지면 더 많은 데이터 로드
      if (logicalRange.from < 10) {
        shouldLoadMoreRef.current = true;
        loadMoreData();
      } else {
        shouldLoadMoreRef.current = false;
      }
    };

    timeScale.subscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange);
      chart.remove();
      chartInstanceRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockCode, selectedGroupIndex, selectedOptionIndex, isPositive, chartType]);

  // 차트 데이터 업데이트 (데이터 변경 시)
  useEffect(() => {
    if (!seriesRef.current || chartData.length === 0) return;

    // 서버에서 받은 dateTime을 그대로 timestamp로 변환 (이미 KST)
    const parseKSTtoTimestamp = (dateTimeStr: string): UTCTimestamp => {
      // YYYY-MM-DDTHH:mm:ss 형식의 문자열을 파싱
      const [datePart, timePart] = dateTimeStr.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      // 서버에서 받은 KST 시간을 그대로 UTC timestamp로 사용
      const timestamp = Date.UTC(year, month - 1, day, hour, minute, second);
      return Math.floor(timestamp / 1000) as UTCTimestamp;
    };

    if (chartType === 'candlestick') {
      // 캔들스틱 차트 데이터
      const candleData = chartData
        .map((item) => ({
          time: parseKSTtoTimestamp(item.dateTime),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))
        .sort((a, b) => a.time - b.time);
      seriesRef.current.setData(candleData);
    } else {
      // 라인/에어리어 차트 데이터
      const lineData = chartData
        .map((item) => ({
          time: parseKSTtoTimestamp(item.dateTime),
          value: item.close,
        }))
        .sort((a, b) => a.time - b.time);
      seriesRef.current.setData(lineData);
    }

    // 초기 로드일 때만 줌 레벨 설정
    if (chartInstanceRef.current && isInitialLoadRef.current) {
      const timeScale = chartInstanceRef.current.timeScale();

      // interval별로 표시할 데이터 포인트 개수 설정
      let visiblePoints: number;
      if (selectedOption.interval.startsWith('min:')) {
        visiblePoints = 40; // 분봉: 40개 캔들
      } else if (selectedOption.interval.startsWith('day:')) {
        visiblePoints = 30; // 일봉: 30개 캔들
      } else if (selectedOption.interval.startsWith('week:')) {
        visiblePoints = 26; // 주봉: 26개 캔들 (약 6개월)
      } else if (selectedOption.interval.startsWith('month:')) {
        visiblePoints = 12; // 월봉: 12개 캔들 (약 1년)
      } else {
        visiblePoints = 5; // 년봉: 5개 캔들
      }

      // 최신 데이터를 오른쪽에 표시하도록 범위 설정
      const dataLength = chartData.length;
      timeScale.setVisibleLogicalRange({
        from: Math.max(0, dataLength - visiblePoints),
        to: dataLength - 1,
      });

      // 초기 로드 완료 후 플래그 해제
      isInitialLoadRef.current = false;
    }
  }, [chartData, selectedOption.interval, chartType]);

  const handleGroupChange = (groupIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedOptionIndex(0);
    setIsDropdownOpen(false);
  };

  const handleOptionChange = (optionIndex: number) => {
    setSelectedOptionIndex(optionIndex);
    setIsDropdownOpen(false);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    setIsChartTypeDropdownOpen(false);
  };

  // 차트 타입별 아이콘 컴포넌트
  const CandlestickIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="2" height="2" fill="currentColor" />
      <rect x="3" y="6" width="2" height="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="3" y="12" width="2" height="2" fill="currentColor" />
      <rect x="7" y="4" width="2" height="2" fill="currentColor" />
      <rect x="7" y="8" width="2" height="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="7" y="13" width="2" height="1" fill="currentColor" />
      <rect x="11" y="1" width="2" height="3" fill="currentColor" />
      <rect x="11" y="6" width="2" height="5" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="11" y="13" width="2" height="2" fill="currentColor" />
    </svg>
  );

  const AreaIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 14 L1 10 L4 6 L7 9 L10 4 L13 7 L15 5 L15 14 Z" fill="currentColor" opacity="0.3" />
      <path d="M1 10 L4 6 L7 9 L10 4 L13 7 L15 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );

  const LineIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12 L4 8 L7 10 L10 4 L13 6 L15 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );

  const chartTypeOptions = [
    { type: 'candlestick' as ChartType, label: '캔들', icon: <CandlestickIcon /> },
    { type: 'area' as ChartType, label: '영역', icon: <AreaIcon /> },
    { type: 'line' as ChartType, label: '라인', icon: <LineIcon /> },
  ];

  const currentChartType = chartTypeOptions.find(opt => opt.type === chartType);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">주가 차트</h3>
        <div className="flex items-center gap-4">
          {/* 차트 타입 선택 */}
          <div className="relative">
            <button
              onClick={() => setIsChartTypeDropdownOpen(!isChartTypeDropdownOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {currentChartType?.icon}
            </button>

            {isChartTypeDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-background border border-border rounded-md shadow-lg z-10 min-w-[100px]">
                {chartTypeOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleChartTypeChange(option.type)}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md flex items-center gap-2"
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 기간 선택 */}
          <div className="relative flex gap-1">
            {periodGroups.map((group, groupIndex) => (
            <div key={group.label} className="relative">
              <button
                onClick={() => {
                  if (group.options.length === 1) {
                    handleGroupChange(groupIndex);
                  } else {
                    if (selectedGroupIndex === groupIndex) {
                      setIsDropdownOpen(!isDropdownOpen);
                    } else {
                      handleGroupChange(groupIndex);
                      setIsDropdownOpen(true);
                    }
                  }
                }}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-all",
                  selectedGroupIndex === groupIndex
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {group.label}
              </button>

              {selectedGroupIndex === groupIndex && isDropdownOpen && group.options.length > 1 && (
                <div className="absolute top-full mt-1 right-0 bg-background border border-border rounded-md shadow-lg z-10 min-w-[100px]">
                  {group.options.map((option, optionIndex) => (
                    <button
                      key={option.label}
                      onClick={() => handleOptionChange(optionIndex)}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md",
                        selectedOptionIndex === optionIndex
                          ? "bg-muted font-medium"
                          : ""
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">차트 로딩 중...</p>
        </div>
      ) : (
        <div ref={chartContainerRef} className="h-[350px]" />
      )}
    </div>
  );
};

export default StockChart;
