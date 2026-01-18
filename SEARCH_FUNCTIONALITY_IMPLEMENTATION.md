# 건의게시판 검색 기능 구현

## 개요
건의게시판의 SearchBar 컴포넌트가 제목, 내용, 지역으로 검색할 수 있도록 백엔드와 프론트엔드를 수정했습니다.

## 변경 사항

### 백엔드 (Backend)

#### 1. SuggestionRepository.java
- `findByFiltersWithUser` 쿼리 메서드에 검색 파라미터 추가
- 제목(title), 내용(content), 주소(address)에서 검색어를 찾도록 LIKE 조건 추가
- 검색어는 부분 일치(LIKE '%search%')로 동작

```java
@Query("SELECT s FROM Suggestion s LEFT JOIN FETCH s.user WHERE " +
       "(:status IS NULL OR s.status = :status) AND " +
       "(:type IS NULL OR s.suggestionType = :type) AND " +
       "(:region IS NULL OR s.address LIKE CONCAT(:region, '%')) AND " +
       "(:search IS NULL OR s.title LIKE CONCAT('%', :search, '%') OR s.content LIKE CONCAT('%', :search, '%') OR s.address LIKE CONCAT('%', :search, '%'))")
Page<Suggestion> findByFiltersWithUser(
    @Param("status") SuggestionStatus status,
    @Param("type") SuggestionType type,
    @Param("region") String region,
    @Param("search") String search,
    Pageable pageable
);
```

#### 2. SuggestionController.java
- `getSuggestions` 메서드에 `search` 파라미터 추가
- 검색어를 서비스 레이어로 전달

#### 3. SuggestionService.java
- `findAll` 메서드에 `search` 파라미터 추가
- 검색어 trim 처리 및 null/empty 체크
- 검색어가 있을 때만 검색 필터 적용

### 프론트엔드 (Frontend)

#### 1. board/page.tsx
- 검색 로직 개선: `searchTerm` (입력값)과 `searchQuery` (실제 검색값) 분리
- 사용자가 검색 버튼을 클릭하거나 Enter를 누를 때만 검색 실행
- `useCallback`을 사용하여 `fetchSuggestions` 최적화
- 검색 실행 시 페이지를 1로 리셋

#### 2. SearchBar.tsx
- 이미 올바르게 구현되어 있음 (변경 없음)
- form submit 이벤트로 검색 실행
- 검색 아이콘과 placeholder 텍스트로 UX 제공

## 사용 방법

1. 검색창에 검색어 입력
2. Enter 키를 누르거나 검색 버튼 클릭 (현재는 form submit)
3. 제목, 내용, 주소에서 검색어가 포함된 건의사항 표시
4. 필터와 함께 사용 가능 (상태, 유형, 지역 필터와 조합)

## 검색 동작

- **검색 대상**: 제목, 내용, 주소
- **검색 방식**: 부분 일치 (LIKE '%검색어%')
- **대소문자**: 데이터베이스 설정에 따름 (일반적으로 case-insensitive)
- **공백 처리**: 자동으로 trim 처리
- **빈 검색어**: 전체 목록 표시

## 테스트 방법

1. 백엔드 서버 재시작
2. 프론트엔드 개발 서버 재시작 (필요시)
3. 건의게시판 페이지 접속
4. 검색창에 다양한 검색어 입력하여 테스트:
   - 제목에 포함된 단어
   - 내용에 포함된 단어
   - 지역명 (예: "서울", "강남")
