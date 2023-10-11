pragma solidity ^0.8.0;

pragma solidity ^0.8.0;

contract Contacts {
    address public owner;

    struct Survey {
        uint id;
        string question;
        string[] options;
        uint[] voteCounts;
        string[] tags;
        address creator;
        bool isActive;
        string description;
        string imgURL;
        mapping(address => bool) hasVoted;
        mapping(address => uint) selectedOption;
    }

    struct SurveyResponse {
        uint totalCount;
        SurveySummary[] surveys;
    }

    struct SurveySummary {
        uint id;
        string question;
        string[] options;
        uint[] voteCounts;
        string[] tags;
        bool isActive;
        string description;
        string imgURL;
        address creator;
    }

    mapping(uint => Survey) public surveys;
    mapping(string => uint[]) public surveysByTag;
    uint public surveyCount;
    uint public nextSurveyId;

    event SurveyCreated(uint surveyId, string question, string[] options, string description, string imgURL);
    event SurveyDeleted(uint surveyId);
    event VoteCasted(uint surveyId, string option, uint voteCount);
    event SurveysDeleted();

    constructor() {
        owner = msg.sender;

        for (uint i = 0; i < 8; i++) {
            string[] memory options = new string[](4);
            options[0] = "Option 1";
            options[1] = "Option 2";
            options[2] = "Option 3";
            options[3] = "Option 4";
            string[] memory tags = new string[](3);
            tags[0] = "tag1";
            tags[1] = "tag2";
            tags[2] = "tag3";
            createSurvey(
                "Question...",
                options,
                tags,
                "Description...",
                "../../assets/images/2.jpg");
        }
    }

    function createSurvey(string memory _question, string[] memory _options, string[] memory _tags,
        string memory _description, string memory _imgURL) public {
        require(bytes(_question).length > 0, "Question must not be empty");
        require(_options.length >= 2 && _options.length <= 10, "Survey must have from 2 to 10 options");

        uint surveyId = nextSurveyId++;
        surveys[surveyId].id = surveyId;
        surveys[surveyId].question = _question;
        surveys[surveyId].options = _options;
        surveys[surveyId].voteCounts = new uint[](_options.length);
        surveys[surveyId].creator = msg.sender;
        surveys[surveyId].tags = _tags;
        surveys[surveyId].isActive = true;
        surveys[surveyId].description = _description;
        surveys[surveyId].imgURL = _imgURL;

        for (uint i = 0; i < _tags.length; i++) {
            surveysByTag[_tags[i]].push(surveyId);
        }

        emit SurveyCreated(surveyId, _question, _options, _description, _imgURL);

        surveyCount++;
    }

    function deleteSurvey(uint _surveyId) public {
        require(_surveyId < surveyCount, "Invalid surveyId");

        Survey storage survey = surveys[_surveyId];

        require(survey.creator == msg.sender, "Only the survey creator can delete the survey");

        survey.isActive = false;

        emit SurveyDeleted(_surveyId);
    }

    function vote(uint _surveyId, string memory _option) public {
        require(_surveyId < surveyCount, "Invalid surveyId");
        require(bytes(_option).length > 0, "Option must not be empty");

        Survey storage survey = surveys[_surveyId];

        require(survey.isActive, "The survey is not active");
        require(!survey.hasVoted[msg.sender], "You have already voted in this survey");

        for (uint i = 0; i < survey.options.length; i++) {
            if (keccak256(bytes(survey.options[i])) == keccak256(bytes(_option))) {
                survey.voteCounts[i]++;
                emit VoteCasted(_surveyId, _option, survey.voteCounts[i]);
                survey.selectedOption[msg.sender] = i;
                break;
            }
        }

        survey.hasVoted[msg.sender] = true;
    }

    function getSurveys(uint limit, uint page, string[] calldata tags) public view returns (SurveyResponse memory) {
        require(limit > 0, "Limit must be greater than 0");

        SurveyResponse memory response;

        response.totalCount = surveyCount;
        response.surveys = new SurveySummary[](limit);

        uint count = 0;
        uint i = (page - 1) * limit;

        while(i < surveyCount && count < limit){
            if ((tags.length == 0 || containsAnyTag(surveys[i].tags, tags)) && surveys[i].isActive){
                response.surveys[count] = toSummary(surveys[i]);
                count++;
            }
            i++;
        }

        response.surveys = trim(response.surveys, count);

        return response;
    }

    function toSummary(Survey storage survey) internal view returns (SurveySummary memory) {
        return SurveySummary({
        id: survey.id,
        question: survey.question,
        options: survey.options,
        voteCounts: survey.voteCounts,
        tags: survey.tags,
        isActive: survey.isActive,
        description: survey.description,
        imgURL: survey.imgURL,
        creator: survey.creator
        });
    }

    function containsAnyTag(string[] storage surveyTags, string[] memory tags) internal view returns (bool) {
        for (uint i = 0; i < surveyTags.length; i++) {
            for (uint j = 0; j < tags.length; j++) {
                if (keccak256(bytes(surveyTags[i])) == keccak256(bytes(tags[j]))) {
                    return true;
                }
            }
        }
        return false;
    }

    function trim(SurveySummary[] memory array, uint count) internal pure returns (SurveySummary[] memory) {
        SurveySummary[] memory trimmedArray = new SurveySummary[](count);
        for (uint i = 0; i < count; i++) {
            trimmedArray[i] = array[i];
        }
        return trimmedArray;
    }

    function getResults(uint _surveyId) public view returns (string[] memory, uint[] memory) {
        require(_surveyId < surveyCount, "Invalid surveyId");

        Survey storage survey = surveys[_surveyId];

        return (survey.options, survey.voteCounts);
    }

    function getSurveyById(uint _surveyId) public view returns (
        uint,
        string memory,
        string memory,
        bool,
        string[] memory,
        string[] memory,
        uint[] memory,
        address,
        string memory,
        bool,
        uint)
    {
        require(_surveyId < surveyCount, "Invalid surveyId");

        Survey storage survey = surveys[_surveyId];

        return (
        survey.id,
        survey.question,
        survey.description,
        survey.isActive,
        survey.options,
        survey.tags,
        survey.voteCounts,
        survey.creator,
        survey.imgURL,
        survey.hasVoted[msg.sender],
        survey.selectedOption[msg.sender]
        );
    }

    function deleteAllSurveys() public {
        require(msg.sender == owner, "Only the contract owner can delete all surveys");

        for (uint i = 0; i < surveyCount; i++) {
            delete surveys[i];
        }

        surveyCount = 0;
        nextSurveyId = 0;

        emit SurveysDeleted();
    }
}