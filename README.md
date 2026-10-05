# GyuLab Music Lyric Video — After Effects JSX Template

첨부 레퍼런스처럼 넓은 검정 여백, 어두운 블러 배경, 중앙 세로형 미디어와 하단 중앙 가사를 만드는 재사용 가능한 After Effects 템플릿입니다. [GyuLab_Lyric_Video_Template.jsx](GyuLab_Lyric_Video_Template.jsx)를 실행하면 프로젝트 항목과 1080×1920 / 30fps / 180초 컴포지션을 자동 생성합니다.

JSX는 기본 After Effects 기능만 사용하며, 특정 한글 폰트를 강제하지 않습니다. 설치된 폰트 또는 AE의 폰트 대체 기능으로 실행 실패를 피합니다.

현재 스크립트에는 제공한 `별 보러 가는 밤.wav`, `별 보러 가는 밤_sync.smi`, `DSC08809.jpg`의 Desktop 경로가 기본 소스로 등록되어 있습니다. 해당 파일이 존재하면 실행 시 앨범아트와 음악을 자동으로 가져오고, SMI 타임코드에 맞춰 5개의 가사 레이어를 채웁니다. 기본 길이는 180초이지만 이 WAV가 더 길면 음악이 잘리지 않도록 컴포지션도 자동 확장합니다. 파일이 없으면 빈 재사용 템플릿으로 정상 생성됩니다.

## 1. After Effects에서 JSX 실행

1. Windows용 After Effects를 열고 새 프로젝트를 만듭니다. 빈 프로젝트여도 됩니다.
2. **File > Scripts > Run Script File…** 을 선택합니다.
3. `GyuLab_Lyric_Video_Template.jsx`를 선택합니다.
4. 프로젝트 패널에서 `GYULAB_LYRIC_VIDEO__1080x1920` 컴포지션을 엽니다.

스크립트를 다시 실행하면 별도의 새 템플릿 컴포지션이 생성됩니다. 실행을 취소하려면 바로 `Ctrl+Z`를 사용하세요.

## 생성되는 구조

`GYULAB_LYRIC_VIDEO__1080x1920`에는 다음 레이어가 만들어집니다.

```text
00_CONTROL
01_TITLE / 02_ARTIST
03_MAIN_MEDIA
04_SECTION
05_LYRIC_01 ... 09_LYRIC_05
10_BRANDING
11_BACKGROUND_MEDIA (source reference)
12_BACKGROUND_DARK
13_BACKGROUND_BLUR
```

Main Media는 별도 pre-comp인 `MAIN_MEDIA__REPLACE_SOURCE_HERE`입니다. 배경과 중앙 카드가 이 소스를 함께 참조합니다.

## 2. 음악 넣기

제공한 WAV는 자동으로 `AUDIO__별 보러 가는 밤` 레이어에 들어갑니다. 다른 곡은 MP3/WAV를 Project 패널로 가져온 뒤 이 오디오 레이어를 Alt-드래그로 교체하거나, 마스터 타임라인에 새로 드래그합니다. 음악 길이에 맞춰 컴포지션 길이를 조절합니다. 방법은 아래 6번을 참고하세요.

## 3. Main Media 교체

1. Project 패널에서 `MAIN_MEDIA__REPLACE_SOURCE_HERE`를 엽니다.
2. 이미지 또는 영상을 가져온 뒤, `REPLACE_WITH_IMAGE_OR_VIDEO` 레이어 위로 **Alt 키를 누른 채 드래그**하여 교체합니다.
3. 필요한 경우 이 pre-comp 안에서 소스의 Scale/Position만 조절해 세로 영역을 채웁니다.

마스터 컴포지션의 `03_MAIN_MEDIA`는 선명한 중앙 카드이며, `13_BACKGROUND_BLUR`은 같은 소스를 전체 화면으로 확대해 블러 처리한 배경입니다.

## 4. 제목 변경

마스터 컴포지션에서 `01_TITLE`, `02_ARTIST`를 선택한 뒤 Text 도구로 문구를 수정합니다. 한글 폰트는 Character 패널에서 해당 PC에 설치된 폰트로 선택할 수 있습니다.

## 5. 가사 변경

제공한 SMI가 있으면 타임코드가 자동으로 반영됩니다. 화면은 항상 5줄을 유지하며, 현재 가사만 흰색·43px·굵게 표시됩니다. 나머지는 회색·40px입니다. 가사는 약간 넓은 자간을 사용합니다. 현재 가사는 줄마다 위에서 아래로 이동하고, 다섯 번째 줄이 끝난 후에만 다음 5줄 묶음으로 바뀝니다. 따라서 가사마다 화면 전체가 사라지거나 재로딩되지 않습니다.

서체는 `NanumGothic`을 우선 사용합니다. 설치되어 있지 않으면 After Effects의 사용 가능한 한글 폰트로 대체되며 템플릿 생성은 계속됩니다. 다른 곡에서는 `04_SECTION`과 `05_LYRIC_01`부터 `09_LYRIC_05`까지의 Text Layer 문구를 바꿉니다.

각 가사 레이어는 In/Out 지점에서 0.25초(약 7–8프레임) 자동 페이드합니다. 가사가 바뀌는 시점에 맞춰 레이어를 자르고, 다음 가사 레이어를 복제·수정해 이어 붙이면 됩니다. 필요하면 기존 가사 레이어를 복제해 더 많은 줄·구간을 만듭니다.

## 6. 영상 길이 변경

Project 패널에서 `GYULAB_LYRIC_VIDEO__1080x1920`을 선택하고 **Composition > Composition Settings…** (`Ctrl+K`)에서 Duration을 음악 길이로 설정합니다. 이어서 `MAIN_MEDIA__REPLACE_SOURCE_HERE`도 같은 Duration으로 변경하면 배경과 카드가 끝까지 유지됩니다.

## 7. 렌더링

1. 마스터 컴포지션을 선택합니다.
2. **Composition > Add to Adobe Media Encoder Queue**를 권장합니다.
3. H.264, 1080×1920, 30fps를 선택하고 오디오 AAC를 켭니다.
4. 출력 파일을 지정한 뒤 Render/Start Queue를 실행합니다.

## Control 값

`00_CONTROL`을 선택하고 Effect Controls 패널에서 중앙 미디어 크기/세로 위치, 가사 위치와 줄 간격(기본 82px), 배경 어둡기/블러, 비활성 가사 Opacity를 조절할 수 있습니다. 하단 `10_BRANDING`은 `GYULAB MUSIC` 대신 `MADE WITH SUNO` 등으로 자유롭게 수정할 수 있습니다.

## PC / YouTube용 가로 템플릿

[GyuLab_Lyric_Video_PC_Template.jsx](GyuLab_Lyric_Video_PC_Template.jsx)는 모바일 JSX와 별개의 1920×1080 / 30fps 템플릿입니다. 같은 WAV·SMI·앨범아트를 자동으로 사용하며, 캡처처럼 왼쪽에 840×840 둥근 앨범아트, 오른쪽에 제목·아티스트·5줄 롤링 가사를 배치합니다. After Effects에서 이 JSX를 별도로 실행하세요.
