pragma solidity ^0.8.0;

contract Contacts {
    address public owner;

    struct Survey {
        uint id;
        string question;
        string[10] options;
        uint[10] voteCounts;
        string[] tags;
        address creator;
        bool isActive;
        mapping(address => bool) hasVoted;
    }

    struct SurveySummary {
        uint id;
        string question;
        string[10] options;
        uint[10] voteCounts;
        string[] tags;
        bool isActive;  // We add property isActive
    }

    mapping(uint => Survey) public surveys;
    mapping(string => uint[]) public surveysByTag;
    uint public surveyCount;
    uint public nextSurveyId;

    event SurveyCreated(uint surveyId, string question, string[10] options);
    event SurveyDeleted(uint surveyId);
    event VoteCasted(uint surveyId, string option, uint voteCount);
    event SurveysDeleted();

    constructor() {
        owner = msg.sender;
    }

    function createSurvey(string memory _question, string[10] memory _options, string[] memory _tags) public {
        require(bytes(_question).length > 0, "Question must not be empty");
        require(_options.length > 0, "Survey must have at least one option");

        uint surveyId = nextSurveyId++;
        surveys[surveyId].id = surveyId;
        surveys[surveyId].question = _question;
        surveys[surveyId].options = _options;
        surveys[surveyId].creator = msg.sender;
        surveys[surveyId].tags = _tags;
        surveys[surveyId].isActive = true;

        for (uint i = 0; i < _tags.length; i++) {
            surveysByTag[_tags[i]].push(surveyId);
        }

        emit SurveyCreated(surveyId, _question, _options);

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
                break;
            }
        }

        survey.hasVoted[msg.sender] = true;
    }

    function getSurveys(uint limit, uint page, string[] memory tags) public view returns (SurveySummary[] memory) {
        require(limit > 0, "Limit must be greater than 0");

        SurveySummary[] memory allSurveys = new SurveySummary[](limit);
        uint count = 0;
        uint i = (page - 1) * limit;

        while(i < surveyCount && count < limit){
            if ((tags.length == 0 || containsAnyTag(surveys[i].tags, tags)) && surveys[i].isActive){
                allSurveys[count] = toSummary(surveys[i]);
                count++;
            }
            i++;
        }

        return trim(allSurveys, count);
    }

    function toSummary(Survey storage survey) internal view returns (SurveySummary memory) {
        return SurveySummary({
        id: survey.id,
        question: survey.question,
        options: survey.options,
        voteCounts: survey.voteCounts,
        tags: survey.tags,
        isActive: survey.isActive
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

    function getResults(uint _surveyId) public view returns (string[10] memory, uint[10] memory) {
        require(_surveyId < surveyCount, "Invalid surveyId");

        Survey storage survey = surveys[_surveyId];

        return (survey.options, survey.voteCounts);
    }

    function getSurveyById(uint _surveyId) public view returns (string memory, string[10] memory, uint[10] memory, address, bool) {
        require(_surveyId < surveyCount, "Invalid surveyId");

        Survey storage survey = surveys[_surveyId];

        return (survey.question, survey.options, survey.voteCounts, survey.creator, survey.isActive);
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