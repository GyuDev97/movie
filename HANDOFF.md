# GyuLab Music Lyric Video Template — 인수인계

## 1. 작업 목적

After Effects에서 실행하는 JSX 기반 가사 영상 템플릿이다.

- 모바일: YouTube Shorts / Instagram Reels용 세로 영상
- PC: YouTube용 가로 영상
- WAV, SMI, 앨범아트만 교체해 반복 사용
- `.aep` 파일은 배포하지 않고 JSX가 컴포지션·레이어·키프레임을 생성

## 2. 현재 파일

| 파일 | 역할 |
| --- | --- |
| `GyuLab_Lyric_Video_Template.jsx` | 모바일 템플릿 생성 스크립트 — 1080×1920, 30fps |
| `GyuLab_Lyric_Video_PC_Template.jsx` | PC 템플릿 생성 스크립트 — 1920×1080, 30fps |
| `README.md` | 다른 PC 설치/실행/교체 가이드 |
| `HANDOFF.md` | 이 문서 |

## 3. 현재 기본 소스

두 JSX는 Windows의 `Folder.desktop` 경로를 자동으로 사용한다. 사용자명이 `gyu`가 아니어도 된다.

```text
월급은 어디로 갔을까.wav
월급은 어디로 갔을까_sync.smi
월급을 빨아가는 지출의 호수.png
```

현재 제목은 `월급은 어디로 갔을까`, 아티스트 표기는 `by @gyulabs`다.

다른 곡으로 바꿀 때는 각 JSX 상단의 세 변수만 바꾼다.

```javascript
// 모바일
SUPPLIED_AUDIO
SUPPLIED_ARTWORK
SUPPLIED_SUBTITLES

// PC
AUDIO_PATH
ARTWORK_PATH
SMI_PATH
```

## 4. 모바일 템플릿 사양

생성 컴포지션: `GYULAB_LYRIC_VIDEO__1080x1920`

- 1080×1920 / 30fps
- 기본 180초, WAV가 더 길면 자동 확장
- 중앙 미디어: 폭 540px, 동일 소스를 블러·다크 배경으로 사용
- 제목: Y=315, 54px, Bold
- 아티스트: Y=385
- 가사 시작 Y=1260, 줄 간격 기본 82px
- 브랜딩: `GYULAB MUSIC`, Y=1754
- 섹션 문구는 비워 둔 상태 (`04_SECTION`)

주요 레이어:

```text
00_CONTROL
01_TITLE / 02_ARTIST
03_MAIN_MEDIA
04_SECTION
05_LYRIC_01 ~ 09_LYRIC_05
10_BRANDING
11_BACKGROUND_MEDIA (source reference)
12_BACKGROUND_DARK
13_BACKGROUND_BLUR
```

`00_CONTROL`의 슬라이더는 Main Media Scale/Y, Lyrics Y/Line Spacing, Background Darkness/Blur, Inactive Lyric Opacity다.

## 5. PC 템플릿 사양

생성 컴포지션: `GYULAB_DESKTOP_LYRIC__1920x1080`

- 1920×1080 / 30fps
- 왼쪽: 840×840 둥근 모서리 앨범아트
- 오른쪽: 제목 Y=315, 아티스트 Y=370, 5줄 롤링 가사 시작 Y=470
- 오른쪽 하단: `GYULAB MUSIC`

PC 앨범아트 pre-comp 이름은 `PC_MAIN_MEDIA__REPLACE_SOURCE_HERE`다.

## 6. SMI 가사 로직

지원 형식은 한국어 SAMI/SMI의 다음 구조다.

```smi
<SYNC Start=2560><P Class=KRCC>가사
<SYNC Start=4948><P Class=KRCC>&nbsp;
```

- `&nbsp;` 빈 큐는 건너뜀
- 화면에는 가사 5줄을 유지
- 활성 가사는 위→아래로 한 줄씩 이동
- 활성 가사: 흰색 43px
- 비활성 가사: 회색 40px
- 5번째 줄이 끝난 뒤에만 다음 5줄 묶음으로 교체
- 각 줄 변경 시 전체 가사가 사라지거나 다시 로드되지 않음

SMI에 구간명(Verse/Chorus)이 별도 없어서 `04_SECTION`은 현재 비워 둠.

## 7. 폰트 처리

우선 순위는 `NanumGothic` → `MalgunGothic`이다.

- JSX는 `app.fonts.getFontsByPostScriptName()`으로 AE가 실제 인식한 폰트만 적용한다.
- 폰트가 없으면 기본 한글 폰트로 넘어가며 스크립트가 중단되지 않아야 한다.
- 나눔고딕을 새로 설치했다면 AE를 완전히 종료 후 다시 실행한다.
- 과거 `NULL font instance` 오류가 있었으므로, 존재 여부 확인 없이 `doc.font`에 이름을 직접 넣지 않는다.

## 8. 실행 순서

1. WAV, SMI, PNG/JPG를 Windows 바탕화면에 둔다.
2. After Effects를 재시작한다.
3. **Edit > Preferences > Scripting & Expressions**에서 `Allow Scripts to Write Files and Access Network`를 켠다.
4. 새 프로젝트를 연다.
5. **File > Scripts > Run Script File…** 에서 원하는 JSX를 실행한다.
6. 생성된 마스터 컴포지션을 확인한다.
7. Adobe Media Encoder에서 H.264 / AAC로 렌더한다.

## 9. 수정 시 주의사항

- 모바일과 PC는 별도 JSX다. 곡 소스, 제목, 폰트 처리 변경은 원칙적으로 두 파일에 함께 반영한다.
- 기존 JSX를 실행해 생성된 프로젝트는 자동으로 업데이트되지 않는다. 수정 후에는 새 프로젝트에서 JSX를 다시 실행한다.
- 앨범아트만 바꾸는 경우에는 생성 후 Main Media pre-comp 안의 `REPLACE_WITH_IMAGE_OR_VIDEO`를 Alt-드래그로 교체할 수 있다.
- 큰 구조 변경 전에는 현재 JSX를 별도 백업하고, 모바일/PC 각각 실행 테스트한다.

## 10. 확인 상태 / 남은 검증

- Node 기반 JSX 문법 검사는 통과했다.
- 실제 After Effects 실행은 설치된 AE 버전/폰트 상태에 영향을 받는다.
- 다음 담당자는 새 곡으로 교체할 때 모바일·PC 모두에서 SMI 파싱, 앨범아트 표시, 오디오 길이, 나눔고딕 표시를 먼저 확인한다.
